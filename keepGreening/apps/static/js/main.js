$(document).ready(function () {
    let height = $("#fixed-top").height();
    height -= 150;
    $(".main-container").css("margin-top", height);

    $('.carousel').carousel({
        interval: 2000
    });

    $(".search-options").hide();

    $("#show-options").click(function () {
        show_filters();
    });

    $("#clear-filter").click(function () {
        clear_filters();
    });

    let postCode;
    let sunFull;
    let sunPartial;
    let shadeFull;
    let waterMedium;
    let waterLow;
    let colorGreen;
    let colorYellow;
    let colorOther;
    let seasonSpring;
    let seasonSummer;
    let seasonAutumn;
    let seasonWinter;
    let carbonPlannerAmt = 0;

    $("#search-button").click(function () {
        postCode = $("#inlineFormInput").val();
        sunFull = $("#sunFull").prop("checked");
        sunPartial = $("#sunPartial").prop("checked");
        shadeFull = $("#shadeFull").prop("checked");
        waterMedium = $("#waterMedium").prop("checked");
        waterLow = $("#waterLow").prop("checked");
        colorGreen = $("#colorGreen").prop("checked");
        colorYellow = $("#colorYellow").prop("checked");
        colorOther = $("#colorOther").prop("checked");
        seasonSpring = $("#seasonSpring").prop("checked");
        seasonSummer = $("#seasonSummer").prop("checked");
        seasonAutumn = $("#seasonAutumn").prop("checked");
        seasonWinter = $("#seasonWinter").prop("checked");
        if (!sunFull && !sunPartial && !shadeFull && !waterMedium && !waterLow && !colorGreen && !colorYellow && !colorOther
            && !seasonSpring && !seasonSummer && !seasonAutumn && !seasonWinter) {
            $.getJSON("/results", {
                postCode: postCode
            }, function (data) {
                let resultContainer = $("#result-container");
                resultContainer.html("");
                let resultButtonContainer = $(".result-button-container");
                resultButtonContainer.html("");

                if (data.status_code === 204) {
                    resultContainer.append('<h2 id="error-information" class="row"></h2>');
                    $("#error-information").text(data.error_information);
                } else {
                    render_results(data, carbonPlannerAmt, resultContainer);
                }
            });
        } else {
            $.getJSON('/filter_results', {
                postCode: postCode,
                sunFull: sunFull,
                sunPartial: sunPartial,
                shadeFull: shadeFull,
                waterMedium: waterMedium,
                waterLow: waterLow,
                colorGreen: colorGreen,
                colorYellow: colorYellow,
                colorOther: colorOther,
                seasonSpring: seasonSpring,
                seasonSummer: seasonSummer,
                seasonAutumn: seasonAutumn,
                seasonWinter: seasonWinter
            }, function (data) {
                let resultContainer = $("#result-container");
                resultContainer.html("");
                let resultButtonContainer = $(".result-button-container");
                resultButtonContainer.html("");

                if (data.status_code === 204) {
                    resultContainer.append('<h2 id="error-information" class="row"></h2>');
                    $("#error-information").text(data.error_information);
                } else {
                    render_results(data, carbonPlannerAmt, resultContainer);
                }
            });
        }
    });
});
