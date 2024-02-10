import nlp from 'compromise';

// Function to split text into sentences using a custom sentence splitter
function splitIntoSentences(text) {
    const doc = nlp(text);

    // Split the text into sentences
    const sentences = doc.sentences().out('array');
    return sentences;
}

// Function to balance clusters
function balanceClusters(clusters) {
    // Define a threshold for when to redistribute (e.g., if the last cluster is less than half the average size)
    const averageSize = clusters.reduce((sum, cluster) => sum + cluster.length, 0) / clusters.length;
    const minSize = averageSize / 2;

    if (clusters.length > 1 && clusters[clusters.length - 1].length < minSize) {
        // Attempt to redistribute
        const lastCluster = clusters.pop();
        const prevCluster = clusters.pop();

        // While the last cluster is too short and the previous cluster has sentences to give
        while (lastCluster.length < minSize && prevCluster.length > 0) {
            // Move the last sentence from the previous cluster to the beginning of the last cluster
            lastCluster.unshift(prevCluster.pop());
        }

        // Update the clusters with the redistributed sentences
        clusters.push(prevCluster);
        clusters.push(lastCluster);
    }

    return clusters;
}

// Function to create clusters from sentences
function createClusters(sentences) {
    const clusters = [];
    let currentCluster = [];

    for (const sentence of sentences) {
        // Check if adding the next sentence would exceed the limit
        if (currentCluster.join(' ').length + sentence.length > 512) {
            // If the current cluster is not empty, add it to clusters
            if (currentCluster.length > 0) {
                clusters.push(currentCluster.join(' '));
            }
            // Start a new cluster with the current sentence
            currentCluster = [sentence];
        } else {
            currentCluster.push(sentence);
        }
    }

    // Don't forget to add the last cluster if it's not empty
    if (currentCluster.length > 0) {
        clusters.push(currentCluster.join(' '));
    }

    return clusters;
}

// Function to process text
export function processText(article) {
    const sentences = splitIntoSentences(article);
    const initialClusters = createClusters(sentences);
    const balancedClusters = balanceClusters(initialClusters);
    return balancedClusters;
}