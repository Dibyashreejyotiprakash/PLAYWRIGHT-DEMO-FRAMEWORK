function missing(arr,n){

    let total=n*(n+1)/2;

    let sum=0;

    for(let num of arr)
        sum+=num;

    return total-sum;
}

console.log(missing([1,2,3,5],5));