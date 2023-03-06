class ProductRecommendations extends HTMLElement {
  constructor() {
    super();

    this.loadRecommendations();
  }

  loadRecommendations(){
    
    fetch(this.dataset.url)
      .then(response => response.text())
      .then(text => {
        const html = document.createElement('div');
        html.innerHTML = text;
        const recommendations = html.querySelector('product-recommendations');

        if (recommendations && recommendations.innerHTML.trim().length) {
          this.innerHTML = recommendations.innerHTML;
        }

        if (html.querySelector('.grid__item')) {
          this.classList.add('product-recommendations--loaded');
        }
      })
      .catch(e => {
        console.error(e);
      });
    
  }
}

customElements.define('product-recommendations', ProductRecommendations);
