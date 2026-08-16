function evenCount(arr){

    let count=0;

    for(let i=0;i<arr.length;i++){

        if(arr[i]%2==0)
            count++;
    }

    return count;
}

console.log(evenCount([1,2,3,4,5,6]));