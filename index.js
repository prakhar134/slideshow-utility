// This class holds the responsibilty of observing the component, sticking it to the viewport and navigate through the slideshow for the user.

class Slideshow{
    isStuck = false
    currentStage = 0
    slideThresholds = []
    deltaY = 0;
    cumultivedeltaYThreshold = 1500;
    iObserver
    intersectItem;
    constructor(threshold, intersectItem, slideThresholds){
        this.intersectItem = intersectItem;
        this.iObserver = new IntersectionObserver(items => {
            console.log(items)
            if(items[0].intersectionRatio > threshold - 0.01 && !this.isStuck){
                document.body.setAttribute("scroll", "no")
                document.body.style.overflow="hidden";
                this.isStuck = true
                setTimeout(()=>{
                    window.scrollTo({top:window.scrollY + this.intersectItem.getBoundingClientRect().top,behavior:"smooth"});    
                 },10);
                console.log(`current stage ${this.currentStage}`);
            }
        },{threshold})
        window.addEventListener("wheel", event => this.mousewheelhandler(event))
        this.slideThresholds = slideThresholds
        this.iObserver.observe(intersectItem);
    }
    
    mousewheelhandler(e){
            if(this.isStuck){
                this.deltaY += e.deltaY
                let direction = e.deltaY > 0 ? "increment" : "decrement";
                if(this.deltaY < -1 * (this.slideThresholds[this.currentStage] || this.cumultivedeltaYThreshold) && direction == "decrement"){
                    this.handleStageChange(direction)
                } else if(this.deltaY > (this.slideThresholds[this.currentStage] || this.cumultivedeltaYThreshold) && direction == "increment"){
                    this.handleStageChange(direction)
                }
                console.log(this.deltaY);
            } else {
                this.currentStage = e.deltaY > 0 ? 0 : this.slideThresholds.length - 1;
            }
        }
    handleStageChange(change){
        this.deltaY = 0;
        if(this.allowScroll(change)){
            this.scrollEnable(change);
        } else {
            if(change === "decrement"){
                this.currentStage--
            } else {
                this.currentStage++
            }
            console.log(`current stage ${this.currentStage}`);
        }
    }
    allowScroll(change){
        if((this.currentStage === 0 && change === "decrement") || (this.currentStage === this.slideThresholds.length - 1 && change==="increment")){
            return true
        } else {
            return false
        }
    }

    scrollEnable(){
        document.body.removeAttribute("scroll")
        document.body.style.overflow="auto"
        this.isStuck = false;
        this.iObserver.unobserve(this.intersectItem);
        setTimeout(()=>{   
            this.iObserver.observe(this.intersectItem);
        },1000);
    }
}

let slideThresholds = [1500,1500,1500]; // to differ scroll in different slides
let x = new Slideshow(0.8, document.getElementById("main3"),slideThresholds)

