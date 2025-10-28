// Espera a que la página esté lista
document.addEventListener("DOMContentLoaded", () => {
    // 1. Obtener el ID de la alerta desde la URL
    const params = new URLSearchParams(window.location.search);
    const alertId = params.get('id');

    if (!alertId) {
        document.getElementById('alert-title').innerText = "Error: No se especificó la alerta.";
        return;
    }

    // 2. Cargar el archivo maestro de datos
    fetch('/data/alerts.json')
        .then(response => response.json())
        .then(alerts => {
            // 3. Encontrar la alerta específica por su ID
            const alert = alerts.find(a => a.alert_id === alertId);

            if (!alert) {
                document.getElementById('alert-title').innerText = "Error: Alerta no encontrada.";
                return;
            }

            // 4. Poblar el HTML con los datos de la alerta
            document.title = alert.title; // Actualiza el título de la pestaña
            document.getElementById('alert-title').innerText = alert.title;
            document.getElementById('alert-source').innerText = `Fuente: ${alert.source || 'Desconocida'}`;
            
            // Formatear la fecha
            if (alert.fecha_publicacion) {
                const date = new Date(alert.fecha_publicacion);
                document.getElementById('alert-date').innerText = date.toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' });
            }

            document.getElementById('alert-summary').innerText = alert.summary || alert.descripcion || '';

            // 5. Poblar los detalles (keywords, sentimiento, etc.)
            const detailsContainer = document.getElementById('alert-details');
            let detailsHtml = '';
            if (alert.keyword) {
                const keywords = Array.isArray(alert.keyword) ? alert.keyword.join(', ') : alert.keyword;
                detailsHtml += `<p><strong>Keywords:</strong> ${keywords}</p>`;
            }
            if (alert.sentimiento) {
                detailsHtml += `<p><strong>Sentimiento:</strong> ${alert.sentimiento}</p>`;
            }
            if (alert.page_number) {
                detailsHtml += `<p><strong>Página:</strong> ${alert.page_number}</p>`;
            }
            // Puedes añadir más campos del JSON aquí (tier, lugar, etc.)
            detailsContainer.innerHTML = detailsHtml;

            // 6. Manejar el enlace original
            if (alert.link) {
                document.getElementById('original-link').href = alert.link;
            } else {
                document.getElementById('original-link').style.display = 'none'; // Ocultar si no hay link (impresos)
            }

            // 7. ¡CRÍTICO! Manejar las imágenes de medios impresos
            const imagesContainer = document.getElementById('alert-images');
            if (alert.image_urls && alert.image_urls.length > 0) {
                let imagesHtml = '';
                alert.image_urls.forEach(imageUrl => {
                    // La URL es relativa a la raíz del sitio (ej. "data/images/foto.jpg")
                    imagesHtml += `<img src="${imageUrl}" alt="Captura de medio impreso">`;
                });
                imagesContainer.innerHTML = imagesHtml;
            }
        })
        .catch(error => {
            console.error("Error al cargar la alerta:", error);
            document.getElementById('alert-title').innerText = "Error al cargar los datos de la alerta.";
        });
});