function oddCount(arr){

    let count=0;

    for(let num of arr){

        if(num%2!=0)
            count++;
    }

    return count;
}

console.log(oddCount([1,2,3,4,5]));