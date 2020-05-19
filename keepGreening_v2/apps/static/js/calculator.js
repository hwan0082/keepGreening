$(document).ready(function () {
    let calculator_total = 0;

    let add_to_list_button = $("#add-to-list-button");

    let chart;

    let chart_data = [
        {
            "type": "Your garden",
            "carbon": 0
        },
        {
            "type": "Plane",
            "carbon": 1882
        },
        {
            "type": "Rocket",
            "carbon": 1809
        },
        {
            "type": "Car",
            "carbon": 1322
        }
    ];

    let index = 0;
    let qty = $("#planner-qty").text();
    if (qty) {
        chart_data.unshift({"type": "Your planner", "carbon": parseFloat(qty)});
        index = 1;
    }

    add_to_list_button.click(function () {
        let option = $(".custom-select option:selected");
        let plant_type;
        let carbon_absorption;
        let quantity;
        let quantity_validated = false;
        let plant_type_validated = false;

        if (option.text() === "--Select--") {
            $("#selector-error-span").text("Please select a plant type.");
        } else {
            $("#selector-error-span").text("");
            plant_type = option.text();
            carbon_absorption = parseFloat(option.val());
            plant_type_validated = true;
        }

        quantity = $("#plant-quantity").val();
        if (quantity === "") {
            $("#input-error-span").text("PLease enter the quantity of the plant.");
        } else if (!isNaN(quantity)) {
            quantity = parseInt(quantity);
            if (quantity > 0) {
                $("#input-error-span").text("");
                quantity_validated = true;
            } else {
                $("#input-error-span").text("Number should be greater than 0.");
            }
        } else {
            $("#input-error-span").text("Please enter a valid number.");
        }

        if (quantity_validated && plant_type_validated) {
            console.log("Add to list.")
        }
    });

    $(".plus").click(function () {
        let button = $(this);
        add_quantity(button);
    });

    $(".minus").click(function () {
        let button = $(this);
        minus_quantity(button);
    });

    $(".clear").click(function () {
        reset_all_quantities();
    });

    $(".reset").click(function () {
        let button = $(this);
        reset_quantity(button);
    });

    function add_quantity(button) {
        let input = button.closest('td').find(".input-quantity");
        let quantity = parseInt(input.val());
        let plantType = button.closest('td').closest('tr').find('.plant-type').text();
        quantity += 1;
        input.val(quantity);

        calculation(plantType, 1);
    }

    function minus_quantity(button) {
        let input = button.closest('td').find(".input-quantity");
        let quantity = parseInt(input.val());
        let plantType = button.closest('td').closest('tr').find('.plant-type').text();
        quantity -= 1;
        if (quantity >= 0) {
            input.val(quantity);
        } else {
            input.val(0);
        }

        calculation(plantType, -1);
    }

    function reset_quantity(button) {
        let input = button.closest('td').prev('td').find(".input-quantity");
        let quantity = parseInt(input.val());
        let plantType = button.closest('td').closest('tr').find('.plant-type').text();
        input.val("0");

        calculation(plantType, -1 * quantity);
    }

    function reset_all_quantities() {
        $(".input-quantity").each(function (index, element) {
            $(element).val("0");
        });

        calculator_total = 0;
        display_total_absorption(calculator_total);
    }

    function calculation(plant_type, multiply_by) {
        let plant_type_dict = {
            "Large Deciduous": 107.20,
            "Medium Deciduous": 48.58,
            "Small Deciduous": 11.72,
            "Large Evergreen": 110.52,
            "Medium Evergreen": 38.29,
            "Small Evergreen": 32.98,
            "Large Shrub": 22,
            "Medium Shrub": 5,
            "Small Shrub": 1,
            "Grass (square meter)": 0.19
        };
        calculator_total += plant_type_dict[plant_type] * multiply_by;

        display_total_absorption(calculator_total);
    }

    function display_total_absorption(calculator_total) {
        $("#carbon-absorption").text(calculator_total.toFixed(2) + " kg");
        chart_data[index]["carbon"] = calculator_total;
        visualization(chart_data);
    }

    function visualization(chart_data) {
        chart.data = chart_data;
        chart.invalidateRawData();
    }

    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        chart = am4core.create("chartdiv", am4charts.XYChart);

        // Add data
        chart.data = chart_data;

        // Create axes

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "type";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;

        categoryAxis.renderer.labels.template.adapter.add("dy", function (dy, target) {
            if (target.dataItem && target.dataItem.index & 2 == 2) {
                return dy + 25;
            }
            return dy;
        });

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;

        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "carbon";
        series.dataFields.categoryX = "type";
        series.name = "Carbon";
        series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
        series.columns.template.fillOpacity = .8;
        series.columns.template.fill = am4core.color("#71b973");

        var columnTemplate = series.columns.template;
        columnTemplate.strokeWidth = 2;
        columnTemplate.strokeOpacity = 1;
        // Themes end
    });
});