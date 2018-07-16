export function notify(message, type){

console.log("message", message);
    $.growl({
        message: message
    },{
        type: type,
        allow_dismiss: false,
        placement: {
            from: 'top',
            align: 'center'
        },
        delay: 2500,
        animate: {
                enter: 'animated bounceIn',
                exit: 'animated fadeOutRight'
        },
        offset: {
            x: 30,
            y: 30
        }
    });
};