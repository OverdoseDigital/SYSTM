$( document ).ready(function() {
    $('.c-exp-tabs__item-btn').click(function(){
        $('.c-exp-tabs__item').removeClass('is-active');
        $(this).parents('.c-exp-tabs__item').addClass('is-active');
    });
});
