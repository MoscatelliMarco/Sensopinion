from newsplease import NewsPlease
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from sklearn.cluster import KMeans
from variables import categories, subcategory_1, subcategory_2, subcategory_3
from text_blob import TextBlob
import copy
import nltk

# Load the classifiers
emotion_model_path = './models/emotions_classifier'
categories_model_path = './models/classes_classifier'
emotion_tokenizer = AutoTokenizer.from_pretrained(emotion_model_path)
emotion_model = AutoModelForSequenceClassification.from_pretrained(emotion_model_path)
emotions_classifier = pipeline("text-classification", model=emotion_model, tokenizer=emotion_tokenizer, return_all_scores=True)
categories_tokenizer = AutoTokenizer.from_pretrained(categories_model_path)
categories_model = AutoModelForSequenceClassification.from_pretrained(categories_model_path)
categories_classifier = pipeline("zero-shot-classification", model=categories_model, tokenizer=categories_tokenizer)

def process_article(url):
    article = NewsPlease.from_url(url)

    article_text = article.maintext
    article_description = article.description
    article_date_publish = article.date_publish
    article_image = article.image_url

    if not article_description:
        print("Article invalid no description")
        return None

    # Emotions
    try:
        clusters = process_text(article_text)
    except:
        print("A sentence or more in the article exceed the max amount of 512 chars")
        return

    clusters_dict = []
    for i, cluster in enumerate(clusters_dict, 1):
        words = cluster.split()
        dict_append = {
            'chars': len(cluster), 
            'words': len(words), 
            'content': sentence,
            'emotions': {}
        }
        for item in emotions_class(cluster)[0]:
            dict_append['emotions'][item['label']] = item['score']

        sentence_dict.append(dict_append)

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
    blob = TextBlob(article_text)
    sentiment = blob.sentiment
    sentiment = {
        "polarity": (sentiment['polarity'] + 1) / 2, # Here the polarity is scaled from 0 to 1
        "subjectivity": sentiment['subjectivity']
    }

    # Categories
    valid_categories, valid_subcategories = pick_categories(article_description)

    return emotions_percentage, sentiment, valid_categories, valid_subcategories, article_date_publish

    
def pick_categories(text, max_selectable_subcategories=5):
    categories_an = copy.deepcopy(categories)
    categories_an.append("Others")

    output = categories_classifier(text, candidate_labels, multi_label=True)

    # Apply kmeans
    data_train = np.array(output['scores']).reshape(-1, 1)
    kmeans = KMeans(n_clusters=2, n_init=10)
    kmeans.fit(data_train)
    labels = kmeans.labels_
    cluster_averages = [data_train[labels == i].mean() for i in range(2)]
    higher_avg_cluster = np.argmax(cluster_averages)
    indices_higher_cluster = np.where(labels == higher_avg_cluster)[0]

    # Find valid labels
    index_low_cluster_start = indices_higher_cluster[-1] + 1
    valid_categories = []
    for i, label in enumerate(output['labels']):
        if i < index_low_cluster_start:
            if label != "Others":
                valid_categories.append(label)
            else:
                break

    valid_subcategories = []

    for category in valid_categories:
        category_index = np.where(np.array(categories == category))[0]
        output = categories_classifier(text, subcategories[category_index], multi_label=True)

        # Apply kmeans
        data_train = np.array(output['scores']).reshape(-1, 1)
        kmeans = KMeans(n_clusters=2, n_init=10)
        kmeans.fit(data_train)
        labels = kmeans.labels_
        cluster_averages = [data_train[labels == i].mean() for i in range(2)]
        higher_avg_cluster = np.argmax(cluster_averages)
        indices_higher_cluster = np.where(labels == higher_avg_cluster)[0]

        # Find valid labels
        index_low_cluster_start = indices_higher_cluster[-1] + 1
        valid_subcategories_append = []
        for i, label in enumerate(output['labels']):
            if i < index_low_cluster_start:
                if i < max_selectable_subcategories:
                    if label != "Others":
                        valid_subcategories_append.append(label)
                    else:
                        break
        valid_subcategories.append(valid_subcategories_append)

    return valid_categories, valid_subcategories

def split_into_sentences(text):
    nltk.download('punkt')  # Required for the first time
    tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')
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