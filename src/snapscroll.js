const SnapScroll = (selector, options) => {
    const defaults = {
        proximity: 100,
        duration: 200,
        easing: time => time,
        onSnapWait: 50,
        ...options,
    };

    const items = [...document.querySelectorAll(selector)];
    let positions = [];
    let snapTimeout;
    let isScrolling;

    const getPositions = () => {
        positions = items.map(item => ({
            offset: item.offsetTop,
            element: item,
        }));
    };

    const animatedScrollTo = (scrollTargetY = 0, callback) => {
        const { scrollY } = window;
        let currentTime = 0;
        const time = Math.max(0.1, Math.min(
            Math.abs(scrollY - scrollTargetY) / defaults.duration, 0.8,
        ));

        const tick = () => {
            currentTime += 1 / 60;
            const p = currentTime / time;
            const t = defaults.easing(p);

            if (p < 1) {
                requestAnimationFrame(tick);
                window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
            } else {
                window.scrollTo(0, scrollTargetY);
                callback();
            }
        };

        tick();
    };

    const snapToElement = () => {
        const { scrollY } = window;
        const snapElement = positions.find(element => element.offset - defaults.proximity <= scrollY
            && element.offset + defaults.proximity >= scrollY);

        clearTimeout(snapTimeout);

        if (snapElement && !isScrolling) {
            snapTimeout = setTimeout(() => {
                isScrolling = true;
                animatedScrollTo(snapElement.offset, () => {
                    isScrolling = !isScrolling;
                });
            }, defaults.onSnapWait);
        }
    };

    const recalculateLayout = () => {
        getPositions();
        snapToElement();
    };

    const bindEvents = () => {
        window.addEventListener('resize', recalculateLayout);
        window.addEventListener('scroll', snapToElement);
    };

    const destroy = () => {
        window.removeEventListener('resize', recalculateLayout);
        window.removeEventListener('scroll', snapToElement);
    };

    const init = () => {
        getPositions();
        bindEvents();
    };

    init();

    return {
        init,
        destroy,
        recalculateLayout,
    };
};

export default SnapScroll;
