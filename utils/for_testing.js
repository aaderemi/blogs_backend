const palindrome = (string)=>{
    return string.split('').reverse().join('')
}

const averager = (array)=>{
    const summer = (sum, item)=>{
        return sum + item
    }

    return array.reduce(summer, 0)/array.length
}

module.exports = {
    palindrome,
    averager
}