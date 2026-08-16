function largest(arr) {

    let max = arr[0];

    for (let i = 1; i < arr.length; i++) {

        if (arr[i] > max)
            max = arr[i];
    }

    return max;
}

console.log(largest([10, 20, 5, 40, 15]));