function passwordCheck(password: string) : boolean{
    if (password.length >= 8) {
        return true
    } else {
        return false
    }
}