function search(arr,target){

    for(let i=0;i<arr.length;i++){

        if(arr[i]==target)
            return i;
    }

    return -1;
}

console.log(search([10,20,30,40],30));