const attribute_a_input = document.getElementById("a");
const attribute_b_input = document.getElementById("b");
const attribute_c_input = document.getElementById("c");
const skill_point_input = document.getElementById("fw");
const modifier_input = document.getElementById("mod");

const dice = Array.from({ length: 20 }, (_, i) => i + 1);
const three_dice = (() => {
    let arr = []
    dice.forEach((a) => {
        dice.forEach((b) => {
            dice.forEach((c) => {
                arr.push([a, b, c])
            })
        })
    });
    return arr;
})();

const getInput = () => {
    return {
        attribute_a: parseInt(attribute_a_input.value, 10),
        attribute_b: parseInt(attribute_b_input.value, 10),
        attribute_c: parseInt(attribute_c_input.value, 10),
        skill_points: parseInt(skill_point_input.value, 10),
        modifier: parseInt(modifier_input.value, 10),
    };
};

let calculate_remaining_points = (input, rolled) => {
    let [a, b, c] = rolled;
    let points = input.skill_points;

    /* Regelwerk: S. 24 */
    const one_count = [a, b, c].filter((x) => x === 1).length;
    if (one_count == 2) { return points; }
    if (one_count == 3) { return points * 2; }

    const twenty_count = [a, b, c].filter((x) => x === 20).length;
    if (twenty_count >= 2) { return 0; }

    const mod = input.modifier || 0;
    const p = points
        + Math.min(input.attribute_a + mod - a, 0)
        + Math.min(input.attribute_b + mod - b, 0)
        + Math.min(input.attribute_c + mod - c, 0);

    return p;
};

let points_to_qs = (points) => {
    if (points < 0) { return 0; }
    if (0 <= points && points <= 3) { return 1; }
    if (4 <= points && points <= 6) { return 2; }
    if (7 <= points && points <= 9) { return 3; }
    if (10 <= points && points <= 12) { return 4; }
    if (13 <= points && points <= 15) { return 5; }
    return 6;
}

let evaluate_all_rolls = (input) => {
    let quality_levels = Array.from({ length: 7 }, () => 0);
    let expected_value = 0;
    three_dice.forEach((roll) => {
        const points = calculate_remaining_points(input, roll);
        const qs = points_to_qs(points);
        quality_levels[qs] += 1;
        expected_value += qs * (1 / three_dice.length);
    });
    quality_levels = quality_levels.map((count) => count / three_dice.length);
    return { quality_levels, expected_value };
};

let to_percent = (roll_count) => (100 * roll_count).toFixed(2);

let write_output = ({ quality_levels, expected_value }) => {
    for (const i in quality_levels) {
        const span = document.getElementById("qs" + i);
        span.innerText = to_percent(quality_levels[i]);
    }
    document.getElementById("expected").innerText = expected_value.toFixed(2);
};

let unset_output = () => {
    for (const i in Array(7).keys) {
        document.getElementById("qs" + i).innerText = "??";
    }
    document.getElementById("expected").innerText = "??";
};

let validate_input = (input) => {
    return input.attribute_a
        && 0 < input.attribute_a
        && 20 >= input.attribute_a
        && input.attribute_b
        && 0 < input.attribute_b
        && 20 >= input.attribute_b
        && input.attribute_c
        && 0 < input.attribute_c
        && 20 >= input.attribute_c
        && (input.skill_points || input.skill_points === 0)
        && 0 <= input.skill_points
        ;
};

let update = () => {
    const input = getInput();
    if (validate_input(input)) {
        const result = evaluate_all_rolls(input);
        write_output(result);
    } else {
        unset_output();
    }
};

attribute_a_input.onchange = () => update();
attribute_b_input.onchange = () => update();
attribute_c_input.onchange = () => update();
skill_point_input.onchange = () => update();
modifier_input.onchange = () => update();
update();
