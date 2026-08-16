function smallest(arr) {

    let min = arr[0];

    for (let i = 1; i < arr.length; i++) {

        if (arr[i] < min)
            min = arr[i];
    }

    return min;
}

console.log(smallest([10,20,5,40]));