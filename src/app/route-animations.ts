import {
    trigger,
    transition,
    style,
    query,
    group,
    animateChild,
    animate,
    keyframes,
} from '@angular/animations';

// slide animation
export const slider =
    trigger("routeAnimation", [
        // home to other pages
        transition("home => *", slideTo("right")),

        // add to other pages
        transition("add => home", slideTo("left")),
        transition("add => all", slideTo("right")),
        transition("add => session", slideTo("right")),
        transition("add => about", slideTo("right")),

        // all to other pages
        transition("all => home", slideTo("left")),
        transition("all => add", slideTo("left")),
        transition("all => session", slideTo("right")),
        transition("all => about", slideTo("right")),

        // session to other pages
        transition("session => home", slideTo("left")),
        transition("session => add", slideTo("left")),
        transition("session => all", slideTo("left")),
        transition("session => about", slideTo("right")),

        // about to other pages
        transition("about => *", slideTo("left")),
    ]);


function slideTo(direction: string) {
    const optional = { optional: true };
    return [
        query(':enter, :leave', [
            style({
                position: 'absolute',
                [direction]: 0,
                width: "100%"
            })
        ], optional),
        query(':enter', [
            style({ [direction]: '-100%' })
        ]),
        group([
            query(':leave', [
                animate('200ms ease', style({ [direction]: '100%' }))
            ], optional),
            query(':enter', [
                animate('200ms ease', style({ [direction]: '0%'}))
            ], optional)
        ])
    ]
}