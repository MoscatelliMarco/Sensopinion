import axios from 'axios';
import { json } from '@sveltejs/kit';

export async function POST({request}) {
    const body = await request.json();
    const text = body.text;

    const data = {
        'inputs': text,
        'parameters': {
            'candidate_labels': ['technology', 'finance', 'politics']
        }
    };

    try {
        const response = await axios.post('https://api-inference.huggingface.co/models/MoritzLaurer/mDeBERTa-v3-base-mnli-xnli', data, {
            headers: { 'Authorization': 'Bearer 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' }
        });

        if (response.data.error) {
            return json({
                status: 500,
                error: response.data.error.message,
            });
        } else {
            return json({
                status: 200,
                data: response.data
            })
        }
    } catch (error) {
        return json({
            status: 500,
            error: error.message,
        });
    }
}