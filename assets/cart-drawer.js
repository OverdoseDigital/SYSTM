class CartDrawer extends HTMLElement {
  constructor() {
    super();
  }

  bindEvents() {
    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
    this.setHeaderCartIconAccessibility();
  }

  loadCartDrawerSection(callback){
    let self = this;

    fetch(`/?view=sections&sections=cart-drawer`)
    .then((response) => {
      return response.text();
    })
    .then(function (data) {
      let parser = new DOMParser();
      let results = JSON.parse(data);
      let docElement = parser.parseFromString(results['cart-drawer'], 'text/html');
      let cartDrawerSection = document.querySelector('cart-drawer');
      cartDrawerSection.innerHTML = docElement.querySelector('cart-drawer').innerHTML;

      if(!self.loaded){
        self.loaded = true;
        self.bindEvents();
        customElements.define('cart-items', CartItems);
      }

      if (typeof callback == 'function'){
        callback()
      }
    })
    .catch(function (err) {
      console.warn('Something went wrong.', err);
    });
  }

  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector('#cart-icon-bubble');
    cartLink.setAttribute('role', 'button');
    cartLink.setAttribute('aria-haspopup', 'dialog');
    cartLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.open(cartLink)
    });
    cartLink.addEventListener('keydown', (event) => {
      if (event.code.toUpperCase() === 'SPACE') {
        event.preventDefault();
        this.open(cartLink);
      }
    });
  }

  open(triggeredBy) {
    if (triggeredBy) this.setActiveElement(triggeredBy);
    const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
    if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) this.setSummaryAccessibility(cartDrawerNote);
    this.classList.add('animate', 'active')


    this.addEventListener('transitionend', () => {
      const containerToTrapFocusOn = this.classList.contains('is-empty') ? this.querySelector('.drawer__inner-empty') : document.getElementById('CartDrawer');
      const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
      trapFocus(containerToTrapFocusOn, focusElement);
    }, { once: true });

    document.body.classList.add('overflow-hidden');
  }

  close() {
    this.classList.remove('active');
    removeTrapFocus(this.activeElement);
    document.body.classList.remove('overflow-hidden');
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute('role', 'button');
    cartDrawerNote.setAttribute('aria-expanded', 'false');

    if(cartDrawerNote.nextElementSibling.getAttribute('id')) {
      cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
    }

    cartDrawerNote.addEventListener('click', (event) => {
      event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
    });

    cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
  }

  renderContents(parsedState) {
    const self = this;
    if(!this.loaded){
      self.loadCartDrawerSection(renderContents);
    }
    else {
      renderContents()
    }

    function renderContents(){
      self.querySelector('.drawer__inner').classList.contains('is-empty') && self.querySelector('.drawer__inner').classList.remove('is-empty');
      self.productId = parsedState.id;
      self.getSectionsToRender().forEach((section => {
        const sectionElement = section.selector ? document.querySelector(section.selector) : document.getElementById(section.id);
        sectionElement.innerHTML = self.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
      }));

      setTimeout(() => {
        self.querySelector('#CartDrawer-Overlay').addEventListener('click', self.close.bind(self));
        self.open();
      });
    }
    
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-drawer',
        selector: '#CartDrawer'
      },
      {
        id: 'cart-icon-bubble'
      }
    ];
  }

  getSectionDOM(html, selector = '.shopify-section') {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector);
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define('cart-drawer', CartDrawer);

document.addEventListener('DOMContentLoaded', (event) => {
  let cartDrawer = document.getElementById('CartDrawer');
  if (!cartDrawer){
    let cartDrawerSection = document.querySelector('cart-drawer');
    if(!cartDrawerSection.loaded){
      cartDrawerSection.loadCartDrawerSection();
    }
  }

  const cartLink = document.querySelector('#cart-icon-bubble');
  cartLink.addEventListener('click', (event) => {
    event.preventDefault();
    if (!document.getElementById('CartDrawer')){
      let cartDrawerSection = document.querySelector('cart-drawer');
      if (!cartDrawerSection.loaded){
        cartDrawerSection.renderContents();
      }
    }
  });
});


