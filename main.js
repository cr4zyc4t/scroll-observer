function getDirection(offset) {
  if (offset > 0) {
    return 1;
  }
  if (offset < 0) {
    return -1;
  }
  return offset;
}

class ScrollObserver extends EventEmitter {
  constructor(el) {
    super();
    this.el = el;

    this.isScrolling = false;
    this.lastScrollData = null;
    this.scrollTop = el.scrollTop;

    this.init();
  }

  onScrollStart(scrollData) {
    this.isScrolling = true;
    this.lastScrollData = scrollData;
    this.emit("scrollStart", { ...scrollData });
  }

  onScroll = (e) => {
    const scrollData = { scrollTop: e.target.scrollTop, scrollLeft: e.target.scrollLeft };
    if (!this.isScrolling) {
      this.onScrollStart(scrollData);
    }
    const scrollDirection = {
      scrollDirectionX: getDirection(scrollData.scrollLeft - this.lastScrollData.scrollLeft),
      scrollDirectionY: getDirection(scrollData.scrollTop - this.lastScrollData.scrollTop),
    };
    this.emit("scroll", { ...scrollData, ...scrollDirection });

    this.lastScrollData = scrollData;
    this.catchScrollEnd();
  };

  onScrollEnd() {
    this.isScrolling = false;
    this.lastScrollData = null;
    this.emit("scrollEnd");
  }

  catchScrollEnd = _.debounce(this.onScrollEnd, 200);

  init() {
    this.el.addEventListener("scroll", this.onScroll);
  }
}

function main() {
  const container = document.getElementById("root");

  const observer = new ScrollObserver(container);

  observer.on("scrollStart", ({ scrollTop }) => console.log("scrollStart", scrollTop));
  observer.on("scroll", ({ scrollTop, scrollDirectionY }) =>
    console.log("scroll", scrollTop, scrollDirectionY)
  );
  observer.on("scrollEnd", () => console.log("scrollEnd"));
}

window.onload = main;
