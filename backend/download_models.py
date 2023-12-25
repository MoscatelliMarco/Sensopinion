if __name__ == '__main__':
    from transformers import pipeline

    emotions_class = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", top_k=None)
    classes_class = pipeline("zero-shot-classification", model="MoritzLaurer/mDeBERTa-v3-base-mnli-xnli")

    emotions_class.model.save_pretrained('./models/emotions_classifier')
    emotions_class.tokenizer.save_pretrained('./models/emotions_classifier')

    classes_class.model.save_pretrained('./models/classes_classifier')
    classes_class.tokenizer.save_pretrained('./models/classes_classifier')