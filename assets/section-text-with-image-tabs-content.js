$(document).ready(function () {
    $('.c-content-block').each(function(index){
        if(index == 0){
            $(this).addClass('is-active');
        }
    });
    $('.c-exp-tabs__item-btn').click(function(){
        var $dataTab = $(this).data('tab');
        $('.c-content-block').removeClass('is-active');
        $('#'+$dataTab).addClass('is-active');
    });
});
