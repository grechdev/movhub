const useAuth = async () => {
  const localStorage = window.localStorage;
  const user = localStorage.getItem('user');

  const auth = () => {
    if (localStorage.getItem('accessToken') !== undefined && localStorage.getItem('accessToken') !== null) {
      axios.get(`http://localhost:5000/users/token/${localStorage.getItem('accessToken')}`)
        .then(res => {
          if (res.data.status) {
            dispatch(allActions.userActions.setUser(res.data.result))
          }
        })
        .catch(err => {
          alert(err.message);
        });
    }
  }

  if (!user) await auth;

  return { ...user };
}

export default useAuth;
