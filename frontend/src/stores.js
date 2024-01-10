import { writable } from 'svelte/store';

export const loadedStore = writable(true)

export const globalStore = writable({
    emotion_dict: {
        'anger': "🤬",
        'disgust': "🤢",
        'fear': "😨",
        'neutral': "😐",
        'sadness': "😭",
        'surprise': "😲",
        'happiness': "😀"
    },
    categories: {
      "politics": [
        "Elections",
        "International Relations",
        "Policy Reforms",
        "Legislation",
        "Civil Rights",
        "Defence And Security",
        "Local Governance",
        "Politics Scandals",
        "Public Opinion",
        "Others"
    ],
      "economy": [
        "Global Economy",
        "Stock Market",
        "Banking",
        "Real Estate",
        "Cryptocurrencies",
        "Insurance",
        "Taxation",
        "Corporate Finance",
        "Economic Policies",
        "Others"
    ],
      "environment": [
        "Climate Change",
        "Renewable Energy",
        "Wildlife",
        "Pollution",
        "Natural Disasters",
        "Agriculture",
        "Water Resources",
        "Environment Laws",
        "Biodiversity",
        "Others"
    ]
    },
    news: undefined
});