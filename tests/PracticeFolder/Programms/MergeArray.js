function merge(arr1,arr2){

    let result=[];

    let k=0;

    for(let i=0;i<arr1.length;i++)
        result[k++]=arr1[i];

    for(let i=0;i<arr2.length;i++)
        result[k++]=arr2[i];

    return result;
}