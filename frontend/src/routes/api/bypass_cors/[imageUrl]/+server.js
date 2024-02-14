export async function GET({ params }) {
    const { imageUrl } = params;
 
    try {
      const response = await fetch(decodeURIComponent(imageUrl));
      const blob = await response.blob();
      const buffer = await blob.arrayBuffer();
      
      // Determine content type based on response headers
      const contentType = response.headers.get('Content-Type') || 'image/jpeg';
  
      return new Response(buffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=604800' // You can adjust cache settings as needed
        }
      });
    } catch (error) {
      console.error('Error fetching image:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch image' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
}