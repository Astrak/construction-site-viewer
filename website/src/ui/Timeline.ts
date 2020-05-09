import { Viewer } from "../app/Viewer";
import { HOTSPOTS } from "../constants/hotspots";
import { state } from "../store";
import { isTouchEvent } from "../utils";
import "./Timeline.css";

const NSString = "http://www.w3.org/2000/svg";

interface IDate {
    year: number;
    month: number;
    day?: number;
}

export class Timeline {
    beginningDate = { year: 2017, month: 10 };
    endDate = { year: 2020, month: 2 };
    domElement = document.createElement("div");
    currentDate: IDate;
    activeDate: IDate;
    captionElement = document.createElementNS(NSString, "svg");
    activeDateElement = document.createElement("span");
    currentDateElement = document.createElement("span");
    constructionSpans: { [key: string]: any } = {};
    captionTweenUnderBottomValue: string;
    captionBottomValue: string;
    mouseDown: boolean = false;
    wantsPickTime: boolean = false;
    activeLocation?: string;

    constructor(
        public viewer: Viewer,
        public activeModes: string[],
        public container: HTMLDivElement
    ) {
        const userDate = new Date();
        this.currentDate = {
            year: userDate.getFullYear(),
            month: userDate.getMonth(),
            day: userDate.getDate(),
        };
        this.activeDate = {
            year: this.currentDate.year,
            month: this.currentDate.month,
        };
        this.domElement.id = "ui-timeline";

        // SVG container for dates and months
        this.captionElement.id = "ui-timeline-caption";
        this.captionBottomValue = "7";
        this.captionTweenUnderBottomValue = (
            Number(this.captionBottomValue) + 3
        ).toString();
        this.captionElement.setAttribute(
            "viewBox",
            "0 0 100 " + this.captionBottomValue
        );
        this.fillCaption();
        this.domElement.appendChild(this.captionElement);

        // current date element
        this.currentDateElement.id = "ui-timeline-current-date";
        this.currentDateElement.style.left =
            this.getPositionFromDate(this.currentDate) + "%";
        this.domElement.appendChild(this.currentDateElement);

        // active date element
        this.activeDateElement.id = "ui-timeline-selector";
        this.activeDateElement.style.left =
            this.getPositionFromDate(this.beginningDate) + "%";
        this.domElement.appendChild(this.activeDateElement);

        /* LISTENERS */
        this.pickTime = this.pickTime.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.domElement.addEventListener("mousedown", this.onMouseDown, false);
        this.domElement.addEventListener("touchstart", this.onMouseDown, false);
        window.addEventListener("mousemove", this.pickTime, false);
        window.addEventListener("touchmove", this.pickTime, false);
        window.addEventListener("mouseup", this.onMouseUp, false);
        window.addEventListener("touchend", this.onMouseUp, false);

        viewer.spotPicker.on(
            "navigation",
            this.showConstructionSpan.bind(this)
        );
        viewer.loader.on(
            "assets-loaded",
            this.setSceneContentToDate.bind(this)
        );
    }

    show() {
        // 1. re-render in case there is uncompiled materials that could break
        // the animation
        this.viewer.renderer.renderer.shadowMap.needsUpdate = true;
        state.updateCamera = true;

        const tween = { value: 3, lastSceneUpdate: 3 };

        // 2. animate appearance
        this.container.appendChild(this.domElement);

        // 3. and tween the construction
        const animation: gsap.core.Tween = TweenLite.to(tween, 5, {
            value: 97,
            delay: 1,
            ease: Power0.easeNone,
            onUpdate() {
                if (this.wantsPickTime) {
                    return animation.kill();
                }
                this.activeDateElement.style.left = tween.value + "%";
                this.activeDate = this.getDateFromPosition(
                    parseFloat(this.activeDateElement.style.left)
                );
                if (tween.value - tween.lastSceneUpdate > 5) {
                    this.setSceneContentToDate(this.activeDate);
                    tween.lastSceneUpdate = tween.value;
                }
                return undefined;
            },
        });
    }

    fillCaption() {
        // 1. construction spans in the background
        // tslint:disable-next-line: forin
        for (const k in HOTSPOTS) {
            const constructionSpan = document.createElementNS(NSString, "rect");
            const startPosition = this.getPositionFromDate(
                (HOTSPOTS as any)[k].begin
            );
            const endPosition = this.getPositionFromDate(
                (HOTSPOTS as any)[k].end
            );
            constructionSpan.setAttribute("x", startPosition.toString());
            constructionSpan.setAttribute(
                "y",
                this.captionTweenUnderBottomValue
            );
            constructionSpan.setAttribute(
                "width",
                (endPosition - startPosition).toString()
            );
            constructionSpan.setAttribute("height", "0.5");
            this.captionElement.appendChild(constructionSpan);
            this.constructionSpans[k] = constructionSpan;
        }

        // 2. caption rects and year text
        const date = JSON.parse(JSON.stringify(this.beginningDate));
        while (
            !(
                date.month === this.endDate.month &&
                date.year === this.endDate.year
            )
        ) {
            date.month++;

            const monthRect = document.createElementNS(NSString, "rect");
            monthRect.setAttribute("fill", "#000");
            monthRect.setAttribute(
                "x",
                this.getPositionFromDate(date).toString()
            );
            monthRect.setAttribute("y", "4");
            monthRect.setAttribute("width", "0.2");
            monthRect.setAttribute("height", "1");
            this.captionElement.appendChild(monthRect);

            if (date.month === 12) {
                date.month = 0;
                date.year++;

                const yearText = document.createElementNS(NSString, "text");
                yearText.setAttribute("stroke", "#000");
                yearText.setAttribute("stroke-width", "0.1");
                yearText.setAttribute("text-anchor", "middle");
                yearText.setAttribute("font-size", "2");
                yearText.setAttribute(
                    "x",
                    this.getPositionFromDate(date).toString()
                );
                yearText.setAttribute("y", "3");
                yearText.innerHTML = date.year;
                this.captionElement.appendChild(yearText);
            }
        }
    }

    onMouseDown(e: MouseEvent | TouchEvent) {
        this.mouseDown = true;
        this.pickTime(e);
    }

    onMouseUp() {
        this.mouseDown = false;
    }

    pickTime(e: MouseEvent | TouchEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (!this.mouseDown) {
            return;
        }

        this.wantsPickTime = true;

        const offsetWidth = (e.target as any).offsetWidth;

        const x = isTouchEvent(e)
            ? (e.touches[0].pageX - (e.target as any).offsetLeft) / offsetWidth
            : (e.pageX - (e.target as any).offsetLeft) / offsetWidth;

        const relativePosition = Math.min(0.999, Math.max(0.03, x)) * 100;

        const date = this.getDateFromPosition(relativePosition);

        this.setDate(date);
    }

    setDate(date: IDate) {
        this.activeDate = date;
        this.activeDateElement.style.left =
            this.getPositionFromDate(date) + "%";
        this.setSceneContentToDate(date);
    }

    getDateFromPosition(relativePosition: number) {
        const totalMonthsSpan =
            this.endDate.year * 12 +
            this.endDate.month -
            (this.beginningDate.year * 12 + this.beginningDate.month);
        const totalDaysSpan = totalMonthsSpan * 30;
        const relativeDay = Math.floor(
            (relativePosition / 100) * totalDaysSpan
        );
        const date: IDate = { ...this.beginningDate };
        if (date.day === undefined) {
            date.day = relativeDay;
        }
        while (date.day > 30) {
            date.day -= 30;
            date.month++;
        }
        while (date.month > 11) {
            date.month -= 12;
            date.year++;
        }
        return date;
    }

    getPositionFromDate(date: IDate) {
        const totalMonthsSpan =
            this.endDate.year * 12 +
            this.endDate.month -
            (this.beginningDate.year * 12 + this.beginningDate.month);
        const currentMonthDuration = Math.min(
            totalMonthsSpan,
            Math.max(
                0,
                date.year * 12 +
                    date.month +
                    (date.day !== undefined ? date.day / 31 : 0) -
                    (this.beginningDate.year * 12 + this.beginningDate.month)
            )
        );

        return (100 * currentMonthDuration) / totalMonthsSpan;
    }

    setSceneContentToDate(date: IDate = this.activeDate) {
        const relativeDate = this.getPositionFromDate(date);

        this.viewer.objectsList.forEach((object) => {
            const data = object.userData;

            const beginDate = data.begin ? data.begin : this.beginningDate;
            const objectRelativeBeginDate = this.getPositionFromDate(beginDate);

            const endDate = data.end ? data.end : this.endDate;
            const objectRelativeEndDate = this.getPositionFromDate(endDate);

            object.visible =
                relativeDate > objectRelativeBeginDate &&
                relativeDate < objectRelativeEndDate &&
                (!object.userData.mode ||
                    this.activeModes.indexOf(object.userData.mode) > -1);
        });

        this.viewer.renderer.renderer.shadowMap.needsUpdate = true;
        state.updateCamera = true;
    }

    showConstructionSpan(location: string) {
        if (this.activeLocation !== undefined) {
            this.hideConstructionSpan(this.activeLocation);
        }

        const tween = { value: this.captionTweenUnderBottomValue };

        TweenLite.to(tween, 1, {
            value: 4.5,
            onUpdate() {
                this.constructionSpans[location].setAttribute("y", tween.value);
            },
            onComplete() {
                this.activeLocation = location;
            },
        });
    }

    hideConstructionSpan(location: string) {
        const tween = {
            value: this.constructionSpans[location].getAttribute("y"),
        };

        TweenLite.to(tween, 0.5, {
            value: this.captionTweenUnderBottomValue,
            onUpdate() {
                this.constructionSpans[location].setAttribute("y", tween.value);
            },
        });
    }
}
