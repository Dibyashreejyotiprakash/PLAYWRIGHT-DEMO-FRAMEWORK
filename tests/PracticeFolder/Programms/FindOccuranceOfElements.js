function frequency(arr){

    for(let i=0;i<arr.length;i++){

        let count=1;

        let visited=false;

        for(let k=0;k<i;k++){

            if(arr[i]==arr[k]){
                visited=true;
                break;
            }
        }

        if(visited)
            continue;

        for(let j=i+1;j<arr.length;j++){

            if(arr[i]==arr[j])
                count++;
        }

        console.log(arr[i],count);
    }
}