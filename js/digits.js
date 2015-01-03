// Motivation
// http://www.uxmatters.com/mt/archives/2013/02/how-do-users-really-hold-mobile-devices.php

;window.Digits = {
    supportsTouch: 'ontouchstart' in window || navigator.msMaxTouchPoints,
    hand: null,
    clues: {
        left: 0,
        right: 0
    },
    htmlTag: document.querySelector('html'),
    scrollStart: null,
    samples: 0,
    maxSamples: 25,
    callback: null,

    init: function () {
        var self = this;
        window.addEventListener('touchstart', this);            
        window.addEventListener('touchmove', this);   
    },
    
    handleEvent: function (event) {
        var i, start, end, top, bottom;
        switch(event.type) {
            case 'touchstart':
                this.scrollStart = {
                    pageX: event.touches[0].pageX, 
                    pageY: event.touches[0].pageY
                };
                break;
            case 'touchmove':
                if (event.touches.length === 1) {
                    // One touch
                    start = this.scrollStart;
                    end = event.touches[0];
                    if (start.pageY > end.pageY) {
                        // Swipe up
                        if (start.pageX < end.pageX) {
                            this.clues.right ++;
                        } else {
                            this.clues.left ++;
                        }
                    } else {
                        // Swipe down
                        if (start.pageX < end.pageX) {
                            this.clues.left ++;
                        } else {
                            this.clues.right ++;
                        }
                    }                    
                }
                else if (event.touches.length === 2) {
                    // Two touches
                    if (event.touches[0].pageY < event.touches[1].pageY) {
                        top = event.touches[0];
                        bottom = event.touches[1];
                    } else {
                        top = event.touches[1];
                        bottom = event.touches[0];
                    }
                    if (top.pageX > bottom.pageX) {
                        this.clues.right ++;   
                    } else {
                        this.clues.left ++;   
                    }
                }
                this.measure();
                break;
        }
    },

    measure: function () {
        
        var newHand;

        if (this.samples === this.maxSamples) {
            this.samples = 0;
            
            newHand = this.clues.right > this.clues.left ? 'right' : 'left';

            if (typeof(this.callback) === 'function' && newHand !== this.hand) {
                this.callback(newHand);
            }
            this.hand = newHand;

            this.clues.right = 0;
            this.clues.left = 0;

            this.htmlTag.className = this.htmlTag.className.replace(/digits\-[^ ]+/,'');
            this.htmlTag.className += ' digits-' + this.hand;
        }
        this.samples ++;
    }
    
};
    
if (Digits.supportsTouch) {
    Digits.init()
}
