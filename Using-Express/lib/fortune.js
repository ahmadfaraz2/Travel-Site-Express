var fortuneCookies = [
    "Conquer your fears or they will conquer you.",
    "River need springs.",
    "Do not fear what you don't know.",
    "You will have pleasent surprise.",
    "Whenever possible, keep it simple.",
];


exports.getFortune = function () {
    var indx = Math.floor(Math.random() * fortuneCookies.length);
    return fortuneCookies[indx];
}