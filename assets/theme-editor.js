document.addEventListener('shopify:block:select', function(event,block,load) {
  const blockSelectedIsSlide = event.target.classList.contains('slideshow__slide');
 
  const blockSelectedIsMegaMenu = event.target.classList.contains('mega-menu-container');

  if (blockSelectedIsSlide){
    const parentSlideshowComponent = event.target.closest('slideshow-component');
    parentSlideshowComponent.pause();

    setTimeout(function() {
      parentSlideshowComponent.slider.scrollTo({
        left: event.target.offsetLeft
      });
    }, 200);
  }
  else if (blockSelectedIsMegaMenu){
    if (!load){
      let liItem = event.target.closest('.mega-menu-item');
      let button = liItem.querySelector('.mega-menu__button')
      if (button){
        button.setAttribute("aria-expanded", true);
      }
    }
    
  }

  
});

document.addEventListener('shopify:block:deselect', function(event,block) {
  const blockSelectedIsSlide = event.target.classList.contains('slideshow__slide');
  const blockSelectedIsMegaMenu = event.target.classList.contains('mega-menu-container');

  if (blockSelectedIsSlide){
       const parentSlideshowComponent = event.target.closest('slideshow-component');
    if (parentSlideshowComponent.autoplayButtonIsSetToPlay) parentSlideshowComponent.play();
  }
  else if (blockSelectedIsMegaMenu){
  
      let liItem = event.target.closest('.mega-menu-item');
      let button = liItem.querySelector('.mega-menu__button')
      if (button){
        button.setAttribute("aria-expanded", true);
      }
    
  }
  
});


document.addEventListener('shopify:section:select', function(event,sectionId) {
  const selectedCartDrawer = event.target.classList.contains('shopify-section-cart-drawer');

  if (selectedCartDrawer){
    const parentSlideshowComponent = event.target.querySelector('cart-drawer');
    parentSlideshowComponent.classList.add('active');
  }

  
});


document.addEventListener('shopify:section:deselect', function(event,sectionId) {
  const selectedCartDrawer = event.target.classList.contains('shopify-section-cart-drawer');

  if (selectedCartDrawer){
    const parentSlideshowComponent = event.target.querySelector('cart-drawer');
    parentSlideshowComponent.classList.remove('active');
  }

  
});t