/**
 * This class contains static utilities for dealing with DOM elements, HTML
 * transitions, effects, and other technical aspects of the game.
 */
class WebUtils {
    /**
     * Given the HTML element and an array of possible parent elements,
     * determines the index of the first element in the array that is a
     * parent (and returns -1 if none are parents.)
     * 
     * This is useful, for example, in event callbacks, because `e.target`
     * often is a child element, and we need the original parent element
     * instead.
     */
    static whichIsParent(child, possibleParents) {
        for(let i=0; i<possibleParents.length; i++) {
            if (possibleParents[i].contains(child)) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Prepare the given array of HTML elements as blocks that can be selected
     * during game -- the mouse events trigger border color changes to
     * indicate the selection status. Only one of the blocks in this array can
     * be selected at a given time, and selecting another block in this array
     * causes the previously selected block to be un-selected.
     * 
     * This models an exclusive option choice in game.
     * 
     * Returns a function that indicates the index of the currently selected
     * element. (We can't just return the index value, since the returned
     * value wouldn't be updated.) If no element is selected, the function
     * returns -1.
     * 
     * You can also specify optional options:
     * 
     * defaultColor -- the border color when there's no mouse over and it's
     *      not selected (default black)
     * 
     * mouseOverColor -- the border color when the mouse goes over an
     *      unselected element (default orange)
     * 
     * selectedColor -- the border color when the block is selected (default
     *      red)
     * 
     * onSelect -- a callback to run when the block is selected, with an
     *      argument of the index selected
     */
    static prepareElsAsSelectableBlocks(els, options) {
        var defaultColor = 'black';
        var mouseOverColor = 'orange';
        var selectedColor = 'red';
        var onSelect = function(index) {};

        if (options) {
            if (options.defaultColor) {
                defaultColor = options.defaultColor;
            }
            if (options.mouseOverColor) {
                mouseOverColor = options.mouseOverColor;
            }
            if (options.selectedColor) {
                selectedColor = options.selectedColor;
            }
            if (options.onSelect) {
                onSelect = options.onSelect;
            }
        }

        // If we do a simple for-loop with index i and try to update els[i],
        // this will fail because during callbacks i will be els.length from
        // the end of the loop, not what the i value was when setting. So we
        // must take care to not use i or another loop variable in a callback.

        var activeIndex = -1;

        for (var i=0; i<els.length; i++) {
            // so that the border is visible
            els[i].style.borderStyle = 'solid';
            els[i].style.borderWidth = 'medium';

            els[i].style.cursor = 'pointer';

            // There is an issue with e.target being a child element instead
            // of the parent div element that we want. We use whichIsParent()
            // to deal with this. (This should only be an issue for onclick,
            // but we use whichIsParent() throughout to be safe.)

            els[i].style.borderColor = defaultColor; // default border color
            els[i].onmouseenter = function(e) {
                var thisElsIndex = WebUtils.whichIsParent(e.target, els);
                // only do the border color animation if this isn't already
                // selected
                if(activeIndex != thisElsIndex) {
                    els[thisElsIndex].style.borderColor = mouseOverColor;
                }
            };
            els[i].onmouseleave = function(e) {
                var thisElsIndex = WebUtils.whichIsParent(e.target, els);
                // only do the border color animation if this isn't already
                // selected
                if(activeIndex != thisElsIndex) {
                    els[thisElsIndex].style.borderColor = defaultColor;
                }
            };
            els[i].onclick = function(e) {
                // unselect the previous one
                if (activeIndex != -1) {
                    els[activeIndex].style.borderColor = defaultColor;
                }
                // now select this one
                var thisElsIndex = WebUtils.whichIsParent(e.target, els);
                els[thisElsIndex].style.borderColor = selectedColor;
                // call the onSelect callback if this was newly selected (not
                // just re-selected)
                if (activeIndex != thisElsIndex) {
                    // update activeIndex first before running onSelect, so
                    // that if onSelect calls the function returned from
                    // prepareElsAsSelectableBlocks, then the info is
                    // consistent
                    activeIndex = thisElsIndex;
                    onSelect(activeIndex);
                }
                else {  // need to update the activeIndex either way
                    activeIndex = thisElsIndex;
                }
            };
        }

        return function() {
            return activeIndex;
        }
    }

    /**
     * Constructs a "slideshow" row of the given array of divs, where arrows
     * to either side can be clicked to navigate the slideshow. Handles
     * transitions as well.
     * 
     * (Since movement transitions can be complex with many nested elements
     * having their own absolute/relative/etc positions, we do fade transitions
     * here.)
     * 
     * Returns the HTML element for the slideshow, and adds the divs directly
     * (therefore modifying their parents), rather than copy them.
     * 
     * You can also specify optional options:
     * 
     * numVisible -- the number of divs visible at a time, default 3
     * 
     * fadeTimeStep -- the time step for the next frame of the fade animation,
     *      default 10 milliseconds
     */
    static prepareSlideshow(divs, options) {
        var numVisible = 3;
        var fadeTimeStep = 10;
        if (options) {
            if (options.numVisible) {
                numVisible = options.numVisible;
            }
            if (options.fadeTimeStep) {
                fadeTimeStep = options.fadeTimeStep;
            }
        }

        // To show a row, we use a table html element.
        // We actually create multiple rows, each flanked by left and right
        // arrow buttons. When the buttons are clicked, we fade transition to
        // the relevant row. Only one row is visible at a time (the others are
        // display: none.)

        var slideShowEl = document.createElement('table');
        var trEls = [];

        // We have to be careful to not refer to loop variables in callbacks.
        // The only variable we can refer to (that won't be changed by the time
        // the callback is triggered) is e.target, the button itself.
        // To deal with this, we include "hidden text" with the button that
        // indicates the index. This text will always be display: none.

        for (let i=0; i<divs.length / numVisible; i++) {
            let trEl = document.createElement('tr');

            // Default every tr element to display: none except the first.

            if(i>0) {
                trEl.style.display = 'none';
            }

            // We append the td elements in order. First, the left button.

            let leftButton = document.createElement('button');
            // style the button to display nicely
            leftButton.style.height = '100%';
            leftButton.style.fontSize = 'large';
            leftButton.innerHTML += (
                `<span>&larr;</span><span style="display:none">${i}</span>`
            );
            if (i==0) {     // nothing comes before, left button disabled
                leftButton.disabled = true;
            }
            // assume that the click can't happen if disabled
            leftButton.onclick = function(e) {
                // Sometimes e.target is the button, other times it's the
                // arrow span element.
                let trElIndexForThisButton;
                if (e.target instanceof HTMLButtonElement) {
                    trElIndexForThisButton = parseFloat(
                        e.target.children.item(1).textContent
                    );
                }
                else if (e.target instanceof HTMLSpanElement) {
                    trElIndexForThisButton = parseFloat(
                        e.target.nextSibling.textContent
                    );
                }
                let trElForThisButton = trEls[trElIndexForThisButton];
                WebUtils.fadeOut(trElForThisButton, () => {
                    trElForThisButton.style.display = 'none';
                    trEls[trElIndexForThisButton-1].style.display = 'inline';
                    trEls[trElIndexForThisButton-1].style.opacity = 1.0;
                }, {
                    fadeTimeStep: fadeTimeStep
                });
            };
            let leftButtonTdEl = document.createElement('td');
            leftButtonTdEl.appendChild(leftButton);
            trEl.appendChild(leftButtonTdEl);
            
            // Next, the div elements in this row.

            let divIndex = i * numVisible;
            // This is necessary since the end row could have less than
            // numVisible divs in it.
            while(divIndex < divs.length) {
                let tdEl = document.createElement('td');
                tdEl.appendChild(divs[divIndex]);
                trEl.appendChild(tdEl);
                divIndex++;
            }

            // Then, the right button.

            let rightButton = document.createElement('button');
            // style the button to display nicely
            rightButton.style.height = '100%';
            rightButton.style.fontSize = 'large';
            rightButton.innerHTML += (
                `<span>&rarr;</span><span style="display:none">${i}</span>`
            );
            // nothing comes before, right button disabled
            if (i>=divs.length/numVisible-1) {
                rightButton.disabled = true;
            }
            // assume that the click can't happen if disabled
            rightButton.onclick = function(e) {
                // Sometimes e.target is the button, other times it's the
                // arrow span element.
                let trElIndexForThisButton;
                if (e.target instanceof HTMLButtonElement) {
                    trElIndexForThisButton = parseFloat(
                        e.target.children.item(1).textContent
                    );
                }
                else if (e.target instanceof HTMLSpanElement) {
                    trElIndexForThisButton = parseFloat(
                        e.target.nextSibling.textContent
                    );
                }
                let trElForThisButton = trEls[trElIndexForThisButton];
                WebUtils.fadeOut(trElForThisButton, () => {
                    trElForThisButton.style.display = 'none';
                    trEls[trElIndexForThisButton+1].style.display = 'inline';
                    trEls[trElIndexForThisButton+1].style.opacity = 1.0;
                }, {
                    fadeTimeStep: fadeTimeStep
                });
            };
            let rightButtonTdEl = document.createElement('td');
            rightButtonTdEl.appendChild(rightButton);
            trEl.appendChild(rightButtonTdEl);

            // Finally, add this tr element to the trEls array (which we
            // expect to be full in the callback, so no issue referring to
            // trEls in the callback.)

            trEls.push(trEl);
        }

        // Add all the tr elements to the parent slideshow element, and return
        // the parent.

        for (let i=0; i<trEls.length; i++) {
            slideShowEl.appendChild(trEls[i]);
        }
        return slideShowEl;
    }

    /**
     * Fade the dom element in, executing the callback after.
     * 
     * You can optionally specify a fadeTimeStep, which is the amount of time
     * to wait until the next frame of the fade animation. By default, this is
     * 80 milliseconds.
     * 
     * Only modifies the style.opacity property, not style.display.
     */
    static fadeIn(domEl, callback, options) {
        var fadeTimeStep = 80;
        if (options && options.fadeTimeStep) {
            fadeTimeStep = options.fadeTimeStep;
        }
        // needed to be consistent about opacity format
        if (! domEl.style.opacity) {
            domEl.style.opacity = 1.0;
        }
        // now, animate the fade
        setTimeout(() => {
            let newOpacity = parseFloat(domEl.style.opacity) + 0.1;
            if (newOpacity > 1.0) {
                domEl.style.opacity = 1.0;
                callback();
            }
            else {
                domEl.style.opacity = newOpacity;
                WebUtils.fadeIn(domEl, callback);
            }
        }, fadeTimeStep);
    }

    /**
     * Fade the dom element out, executing the callback after.
     * 
     * You can optionally specify a fadeTimeStep, which is the amount of time
     * to wait until the next frame of the fade animation. By default, this is
     * 80 milliseconds.
     * 
     * Only modifies the style.opacity property, not style.display.
     */
    static fadeOut(domEl, callback, options) {
        var fadeTimeStep = 80;
        if (options && options.fadeTimeStep) {
            fadeTimeStep = options.fadeTimeStep;
        }
        // needed to be consistent about opacity format
        if (! domEl.style.opacity) {
            domEl.style.opacity = 1.0;
        }
        setTimeout(() => {
            let newOpacity = parseFloat(domEl.style.opacity) - 0.1;
            if (newOpacity < 0.0) {
                domEl.style.opacity = 0.0;
                callback();
            }
            else {
                domEl.style.opacity = newOpacity;
                WebUtils.fadeOut(domEl, callback);
            }
        }, fadeTimeStep);
    }

    /**
     * Progressively fade in the children of the given dom element.
     * 
     * You can optionally specify a fadeTimeout, which is the timeout between
     * each fade in. By default, this is 2000 milliseconds.
     */
    static fadeInChildrenProgressively(domEl, callback, options) {
        var timeoutBetweenTextBlocks = 2000;
        if (options && options.fadeTimeout) {
            timeoutBetweenTextBlocks = options.fadeTimeout;
        }

        var domElChildren = domEl.children;
        // We have to pass in the value of i correctly for the subsequent
        // callbacks, e.g. we can't refer to loop variable i in the callback.
        var fadeInRecursive = function(i) {
            if (i >= domElChildren.length) {  // "base case", going upward
                callback();
                return false;
            }
            WebUtils.fadeIn(domElChildren.item(i), () => {
                // pause for some time
                setTimeout(() => {
                    fadeInRecursive(i+1);
                }, timeoutBetweenTextBlocks);
            });
        };

        fadeInRecursive(0);
    }
}

module.exports = {
    WebUtils: WebUtils
};
