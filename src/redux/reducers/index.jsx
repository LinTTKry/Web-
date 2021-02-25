
export const userReducer = (preState={}, action)=>{
  const {user,type} = action
  // console.log(user,type)
  switch (type){
    case 'saveUser':
      // console.log(user)
      return user
    case 'deleteUser':
      // console.log(user)
      return {}
    default:
      return preState
  }
}
