import sys
sys.path.append("../")

import logging
date_format = "%Y-%m-%d %H:%M:%S"
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', 
                    datefmt=date_format)
logger = logging.getLogger(__name__)

from newsplease import NewsPlease
from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline
from sklearn.cluster import KMeans
from variables import categories, subcategories, black_listed_domains
from textblob import TextBlob
from datetime import datetime, timedelta
import numpy as np
import copy
import nltk
import os
from dotenv import load_dotenv

load_dotenv()

# Set transformers' logging level to WARNING to suppress debug logs
logging.getLogger('newsplease').setLevel(logging.WARNING)

nltk.download('punkt')  # Required for the first time

# Load the classifiers
emotion_model_path = '../models/emotions_classifier'
categories_model_path = '../models/classes_classifier'
logger.info("Load emotion classifier")
emotion_tokenizer = AutoTokenizer.from_pretrained(emotion_model_path)
emotion_model = AutoModelForSequenceClassification.from_pretrained(emotion_model_path)
emotions_classifier = pipeline("text-classification", model=emotion_model, tokenizer=emotion_tokenizer, top_k=None)
logger.info("Load category classifier")
categories_tokenizer = AutoTokenizer.from_pretrained(categories_model_path)
categories_model = AutoModelForSequenceClassification.from_pretrained(categories_model_path)
categories_classifier = pipeline("zero-shot-classification", model=categories_model, tokenizer=categories_tokenizer)
logger.info("Load tokenizer")
tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')

def process_article(url):
    article = NewsPlease.from_url(url)

    logger.info(url)
    
    # If article is a dict that means that the request was negative
    if isinstance(article, dict):
        return {'error': "It looks like the link you provided is invalid"}

    article_text = article.maintext
    article_title = article.title
    article_description = article.description
    article_date_publish = article.date_publish
    article_image = article.image_url


    try:
        clusters = process_text(article_text)
    except:
        return {'error': "A sentence or more in the article exceed the max amount of 512 chars, and this is not allowed by our system."}

    logger.debug("Clustering")
    clusters_dict = []
    for i, cluster in enumerate(clusters, 1):
        words = cluster.split()
        dict_append = {
            'chars': len(cluster), 
            'words': len(words), 
            'content': cluster,
            'emotions': {},
            'sentiment': {}
        }
        for item in emotions_classifier(cluster)[0]:
            dict_append['emotions'][item['label']] = item['score']
        blob = TextBlob(article_text)
        sentiment = blob.sentiment
        dict_append['sentiment']['polarity'] = sentiment.polarity
        dict_append['sentiment']['subjectivity'] = sentiment.subjectivity

        clusters_dict.append(dict_append)

    logger.debug("Analyzing emotions")
    # Take weighted everage of emotions
    emotion_sum_char = 0
    emotion_value = 0
    emotions_percentage = {}
    for emotion in ['anger', 'disgust', 'fear', 'joy', 'neutral', 'sadness', 'surprise']:
        for cluster in clusters_dict:
            emotion_value += cluster['chars'] * cluster['emotions'][emotion]
            emotion_sum_char += cluster['chars']
        emotions_percentage[emotion] = emotion_value / emotion_sum_char
        emotion_value = 0
        emotion_sum_char = 0
    
    # Change name of joy to happiness
    emotions_percentage['happiness'] = emotions_percentage['joy']
    del emotions_percentage['joy']

    # Sentiment
    sentiment = {}
    item_value = 0
    item_sum_char = 0
    for item in ['polarity', 'subjectivity']:
        for cluster in clusters_dict:
            item_value += cluster['chars'] * cluster['sentiment'][item]
            item_sum_char += cluster['chars']
            sentiment[item] = item_value / item_sum_char
            item_value = 0
            item_sum_char = 0
    sentiment['polarity'] = (sentiment['polarity'] + 1) / 2

    # Categories
    logger.debug("Analyzing categories")

    return emotions_percentage, sentiment, [], [], article_date_publish, article_image, article_description, article_title

def process_article_text(text):
    try:
        clusters = process_text(text)
    except:
        logger.info("A sentence or more in the article exceed the max amount of 512 chars")
        return

    # Categories
    logger.debug("Analyzing categories")

    logger.debug("Clustering")
    clusters_dict = []
    for i, cluster in enumerate(clusters, 1):
        words = cluster.split()
        dict_append = {
            'chars': len(cluster), 
            'words': len(words), 
            'content': cluster,
            'emotions': {},
            'sentiment': {}
        }
        for item in emotions_classifier(cluster)[0]:
            dict_append['emotions'][item['label']] = item['score']
        blob = TextBlob(text)
        sentiment = blob.sentiment
        dict_append['sentiment']['polarity'] = sentiment.polarity
        dict_append['sentiment']['subjectivity'] = sentiment.subjectivity

        clusters_dict.append(dict_append)

    logger.debug("Analyzing emotions")
    # Take weighted everage of emotions
    emotion_sum_char = 0
    emotion_value = 0
    emotions_percentage = {}
    for emotion in ['anger', 'disgust', 'fear', 'joy', 'neutral', 'sadness', 'surprise']:
        for cluster in clusters_dict:
            emotion_value += cluster['chars'] * cluster['emotions'][emotion]
            emotion_sum_char += cluster['chars']
        emotions_percentage[emotion] = emotion_value / emotion_sum_char
        emotion_value = 0
        emotion_sum_char = 0
    
    # Change name of joy to happiness
    emotions_percentage['happiness'] = emotions_percentage['joy']
    del emotions_percentage['joy']

    # Sentiment
    sentiment = {}
    item_value = 0
    item_sum_char = 0
    for item in ['polarity', 'subjectivity']:
        for cluster in clusters_dict:
            item_value += cluster['chars'] * cluster['sentiment'][item]
            item_sum_char += cluster['chars']
            sentiment[item] = item_value / item_sum_char
            item_value = 0
            item_sum_char = 0
    sentiment['polarity'] = (sentiment['polarity'] + 1) / 2

    return emotions_percentage, sentiment, [], []

def split_into_sentences(text):
    sentences = tokenizer.tokenize(text)
    return sentences

def balance_clusters(clusters):
    # Define a threshold for when to redistribute (e.g., if the last cluster is less than half the average size)
    average_size = sum(len(cluster) for cluster in clusters) / len(clusters)
    min_size = average_size / 2

    if len(clusters) > 1 and len(clusters[-1]) < min_size:
        # Attempt to redistribute
        last_cluster = clusters[-1].split()
        prev_cluster = clusters[-2].split()

        # While the last cluster is too short and the previous cluster has sentences to give
        while len(' '.join(last_cluster)) < min_size and prev_cluster:
            # Move the last sentence from the previous cluster to the beginning of the last cluster
            last_cluster.insert(0, prev_cluster.pop())

        # Update the clusters with the redistributed sentences
        clusters[-2] = ' '.join(prev_cluster)
        clusters[-1] = ' '.join(last_cluster)

    return clusters

def create_clusters(sentences):
    clusters = []
    current_cluster = ""

    for sentence in sentences:
        # Check if adding the next sentence would exceed the limit
        if len(current_cluster) + len(sentence) > 512:
            # If the current cluster is not empty, add it to clusters
            if current_cluster:
                clusters.append(current_cluster)
            # Start a new cluster with the current sentence
            current_cluster = sentence
        else:
            # Add a space if the cluster already has content
            if current_cluster:
                current_cluster += " "
            current_cluster += sentence

    # Don't forget to add the last cluster if it's not empty
    if current_cluster:
        clusters.append(current_cluster)

    return clusters

def process_text(article):
    sentences = split_into_sentences(article)
    initial_clusters = create_clusters(sentences)
    balanced_clusters = balance_clusters(initial_clusters)
    return balanced_clusters