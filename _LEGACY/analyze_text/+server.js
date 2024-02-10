import { json } from '@sveltejs/kit';
import { processText } from "$lib/server/cluster_sentences"
import axios from 'axios';
import kmeans from 'node-kmeans';

import natural from 'natural';

const categories = import.meta.env.VITE_CATEGORIES.split(',');
const subcategories = {
    [categories[0]]: import.meta.env.VITE_SUBCATEGORIES_1.split(','),
    [categories[1]]: import.meta.env.VITE_SUBCATEGORIES_2.split(','),
    [categories[2]]: import.meta.env.VITE_SUBCATEGORIES_3.split(',')
};

export async function POST(event) {

    const body = await event.request.json()
    const text = body.text;

    const clusters = processText(body.text)

    const clusters_dict = [];
    for (let i = 0; i < clusters.length; i++) {
        const cluster = clusters[i];
        const words = cluster.split(" ");
        const dict_append = {
            chars: cluster.length,
            words: words.length,
            content: cluster,
            emotions: {},
            sentiment: {}
        };
        
        const emotion_analysis = await emotionClassifier(cluster)
        for (let item of emotion_analysis[0]) {
            dict_append['emotions'][item['label']] = item['score']
        }

        clusters_dict.push(dict_append);
    }

    let emotion_sum_char = 0;
    let emotion_value = 0;
    const emotions_percentage = {};
    const emotions = ['anger', 'disgust', 'fear', 'joy', 'neutral', 'sadness', 'surprise'];
    emotions.forEach(emotion => {
        clusters_dict.forEach(cluster => {
            emotion_value += cluster.chars * cluster.emotions[emotion];
            emotion_sum_char += cluster.chars;
        });
        emotions_percentage[emotion] = emotion_value / emotion_sum_char;
        emotion_value = 0;
        emotion_sum_char = 0;
    });

    // Change name of joy to happiness
    emotions_percentage['happiness'] = emotions_percentage['joy'];
    delete emotions_percentage['joy'];

    console.log(emotions_percentage)

    console.log(pick_categories(text))
}

const emotionClassifier = async (text) => {
    const data_emotions = {
        'inputs': text
    };
    const response_emotions = await axios.post('https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base', 
        data_emotions, {
            headers: { 
                'Authorization': 'Bearer ' + import.meta.env.VITE_HUGGING_FACE_TOKEN,
                'Content-Type': 'application/json'
            }
    });

    return response_emotions.data;
}

const categoriesClassifier = async (text, categories, multi_label=false) => {
    const data_categories = {
        'inputs': text,
        "parameters": {
            'candidate_labels': categories,
            "multi_label": multi_label
        }
    };
    const response_categories = await axios.post('https://api-inference.huggingface.co/models/facebook/bart-large-mnli', 
        data_categories, {
            headers: { 
                'Authorization': 'Bearer ' + import.meta.env.VITE_HUGGING_FACE_TOKEN,
                'Content-Type': 'application/json'
            }
    });

    return response_categories.data;
}

async function pick_categories(text, max_selectable_subcategories = 5) {
    // Copy categories
    let categories_an = JSON.parse(JSON.stringify(categories));
    categories_an.push("Others");

    let output = await categoriesClassifier(text, categories_an, true);

    // Apply kmeans
    let data_train = output.scores.map(score => [score]);
    console.log(data_train)
    let value = kmeans.clusterize(
        data_train, {k: 2}, (err,res) => {
            if (err) console.error(err);
            else console.log('%o',res);
        }
    )
    console.log('---------------')
    console.log(value)
    console.log('---------------')
    // let labels = kmeans.fit_predict(data_train);
    let cluster_averages = Array.from({ length: 2 }, (_, i) => data_train.filter((_, j) => labels[j] === i).reduce((acc, val) => acc + val[0], 0) / labels.filter(label => label === i).length);
    let higher_avg_cluster = cluster_averages.indexOf(Math.max(...cluster_averages));
    let indices_higher_cluster = labels.map((label, index) => label === higher_avg_cluster ? index : null).filter(index => index !== null);

    // Find valid labels
    let index_low_cluster_start = indices_higher_cluster[indices_higher_cluster.length - 1] + 1;
    let valid_categories = [];
    for (let i = 0; i < output.labels.length; i++) {
        if (i < index_low_cluster_start) {
            if (output.labels[i] !== "Others") {
                valid_categories.push(output.labels[i]);
            } else {
                console.debug("Label == Others");
                break;
            }
        }
    }

    let valid_subcategories = [];

    for (let category of valid_categories) {
        let category_index = categories.indexOf(category);
        output = categories_classifier(text, subcategories[category_index], true);

        // Apply kmeans
        data_train = output.scores.map(score => [score]);
        kmeans = new KMeans({ k: 2 });
        labels = kmeans.fit_predict(data_train);
        cluster_averages = Array.from({ length: 2 }, (_, i) => data_train.filter((_, j) => labels[j] === i).reduce((acc, val) => acc + val[0], 0) / labels.filter(label => label === i).length);
        higher_avg_cluster = cluster_averages.indexOf(Math.max(...cluster_averages));
        indices_higher_cluster = labels.map((label, index) => label === higher_avg_cluster ? index : null).filter(index => index !== null);

        // Find valid labels
        index_low_cluster_start = indices_higher_cluster[indices_higher_cluster.length - 1] + 1;
        let valid_subcategories_append = [];
        for (let i = 0; i < output.labels.length; i++) {
            if (i < index_low_cluster_start) {
                if (i < max_selectable_subcategories) {
                    if (output.labels[i] !== "Others") {
                        valid_subcategories_append.push(output.labels[i]);
                    } else {
                        if (i === 0) {
                            valid_subcategories_append.push('Others');
                        }
                        break;
                    }
                }
            }
        }
        valid_subcategories.push(valid_subcategories_append);
    }

    return { valid_categories, valid_subcategories };
}
