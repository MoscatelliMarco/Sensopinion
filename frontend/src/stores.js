import { writable } from 'svelte/store';

// Initialize your store with a value.
export const globalStore = writable({
    emotion_dict: {
        'anger': "🤬",
        'disgust': "🤢",
        'fear': "😨",
        'neutral': "😐",
        'sadness': "😭",
        'surprise': "😲",
        'happiness': "😀"
    }
  // ...other shared states
});