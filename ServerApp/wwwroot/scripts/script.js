var radius = 40 ;
var ANG_360 = 360.0 ;
var ANG_180 = 180.0 ;
var ANG_90 = 90 ;
var MAX_VAL = 900 ;

const one = [-81, -77, -73, -68.4];
const two = [-49, -46, -43, -40, -37.8, -35.2, -33.2, -30.2, -27.5, -25];
const three = [-7, -3.25, 0.5, 4.25];
const four = [23,25.8,28.5,31.3,34.1,35.5,39,42.5,46.2];
const five = [61, 63.6, 66.3, 69.5, 72, 74.5, 77, 79.7, 82.5];

const inside_radius = 120 ;
const out_radius = 150;

let isDrawText = false;

function circularText(className, text, radius, range, startPos, css, bottomCss) {

    var textArr = text.split("");
    var container = document.getElementById('circle-chart');

    var containerHeight = container.clientHeight;
    var newElement = document.createElement("div");
    newElement.setAttribute('class', className);

    var deg = range / textArr.length;
    var index = 0;

    textArr.forEach((ch) => {

        if (className == "one") {
            startPos = one[index];
        }

        if (className == "two") {
            startPos = two[index];
        }

        if (className == "three") {
            startPos = three[index];
        }

        if (className == "four") {
            startPos = four[index];
        }

        if (className == "five") {
            startPos = five[index];
        }

        ch = "<p style=\"height:" + radius + "px;" + css + ";transform:rotate(" + startPos + "deg);left:50%;top:" + (containerHeight - radius ) + "px;position:absolute;transform-origin:0 100%; margin:0px;\">" +
            "<span style=\"" + bottomCss + ";transform:rotate(" + startPos + "deg);\">" + ch + "</span>" +
            "</p>";

        newElement.innerHTML += ch;
        startPos += deg;
        ++index;
    });

    container.append(newElement);
}
            
function convertToRadian(angle)
{
    return Math.PI / ANG_180 * angle ;
}

function drawCircle(index, ctx, min_angle, max_angle, min_radian, max_radian, bg_color) {

    ctx.beginPath();

    ctx.moveTo(
        out_radius - out_radius * Math.cos(min_radian),
        out_radius - out_radius * Math.sin(min_radian)
    );

    ctx.arc(
        out_radius, out_radius, out_radius,
        Math.PI + Math.PI / ANG_180 * min_angle,
        Math.PI + Math.PI / ANG_180 * max_angle,
    );

    ctx.lineTo(
        out_radius - inside_radius * Math.cos(max_radian),
        out_radius - inside_radius * Math.sin(max_radian)
    );

    ctx.arc(
        out_radius, out_radius, inside_radius,
        - Math.PI + Math.PI / ANG_180 * max_angle,
        - Math.PI + Math.PI / ANG_180 * min_angle,
        true
    );

    ctx.fillStyle = bg_color;
    ctx.fill();

    ctx.closePath();
}

function DrawIndicator(creditscore, nowTime, lastScore) {
    var radian_angle = 0;
    var angle = 0;
    var temp = 0;

    MAX_VAL = 4 * 140 * 25 * 16 * 9;
    INTER_VAL = MAX_VAL / 180 * 7.5;

    if (creditscore < 560) {
        temp = MAX_VAL / 6 / 900 * creditscore;
    }

    if (creditscore >= 560 && creditscore < 660) {
        temp = MAX_VAL / 6 + MAX_VAL / 6 / 100 * (creditscore - 560) + INTER_VAL;
    }

    if (creditscore >= 660 && creditscore < 725) {
        temp = MAX_VAL / 6 * 2 + MAX_VAL / 6 / 65 * (creditscore - 660) + INTER_VAL * 2;
    }

    if (creditscore >= 725 && creditscore < 760) {
        temp = MAX_VAL / 6 * 3 + MAX_VAL / 6 / 35 * (creditscore - 725) + INTER_VAL * 3;
    }

    if (creditscore >= 760) {
        temp = MAX_VAL / 6 * 4 + MAX_VAL / 6 / 140 * (creditscore - 760) + INTER_VAL * 4;
    }

    if (creditscore >= 900) {
        temp = MAX_VAL;
    }

    console.log(temp);

    radian_angle = Math.PI - Math.PI * temp / MAX_VAL;
    angle = ANG_180 * temp / MAX_VAL - ANG_90;

    let offsetX = radius * Math.cos(Math.PI - radian_angle);
    let offsetY = radius * Math.sin(radian_angle);

    offsetX *= -1;
    offsetY *= -1;

    $('#indicator-container').css('translate', `${offsetX}px ${offsetY}px`);
    $('#indicator-container').css('transform', `rotate(${angle}deg)`);

    $('#current_val').text(`${creditscore}`);
    $('#current_val').text(`${creditscore}`);

    if (creditscore > lastScore) {
        $('#point_count').css({ "color": "#82cfc0" });
        $('#point_count').text("+" + `${creditscore - lastScore}`);
    }

    else {
        $('#point_count').css({ "color": "#d36363" });
        $('#point_count').text(`${creditscore - lastScore}`);
    }
}

function initFunction() {

    const between_angle = 7.5;
    const circle_angle = 30;
    const total_angle = between_angle + circle_angle;

    const chart_info_arr = [
        {
            color: '#d36363'
        },
        {
            color: '#f1af85'
        },
        {
            color: '#f9e382'
        },
        {
            color: '#82cfc0'
        },
        {
            color: '#3d908d'
        }
    ]

    const canvas = document.getElementById("canvas");

    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");
        let color_index = 0;

        for (let i = 0; i < ANG_180; i += total_angle) {
            drawCircle(color_index,
                ctx,
                i, i + circle_angle,
                convertToRadian(i), convertToRadian(i + circle_angle),
                chart_info_arr[color_index].color
            );
            color_index++;
        }
    }

    if (!isDrawText) {

        circularText("one", "POOR", 171, 16, -81, 'font-size: 12px; color:#aaa;', '');

        circularText("two", "ACCEPTABLE", 175, 25, -48, 'font-size: 12px; color:#aaa;', '');

        circularText("three", "GOOD", 176, 15, -7, 'font-size: 12px; color:#aaa;', '');

        circularText("four", "VERY GOOD", 175, 25, 23, 'font-size: 12px; color:#aaa;', '');

        circularText("five", "EXCELLENT", 171, 24, 61, 'font-size: 12px; color:#aaa;', '');

        isDrawText = !isDrawText;
    }
}