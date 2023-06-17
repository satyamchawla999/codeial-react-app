// import { useState,useEffect } from 'react';
import { BrowserRouter as Switch ,Routes , Route, Navigate } from 'react-router-dom';
// import { getPosts } from '../api';
import { useAuth } from '../hooks';
import {Home, Login, Signup, Settings, UserProfile} from '../pages'
import {Loader,Navbar} from './'

const Page404 = ()=> {
  return <h1>404 not found</h1>
}

// function PrivateRoute  (children,...rest)  {
//   const auth= useAuth();

//   return (
//     <Route
//       {...rest}
//       render = {() => {
//         if(auth.user) {
//           return children
//         }

//         return <Navigate to="/login" />
//       }}
//     />
//   )
// }

function PrivateRoute({children}) {
  const auth = useAuth();
  return auth.user ? <>{children}</> : <Navigate to="/login"/>
}

function App() {
  // const [posts, setPosts] = useState([]);
  // const [loading, setLoading] = useState(true);
  
  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     const response = await getPosts();

  //     if(response.success) {
  //       setPosts(response.data.posts);
  //     }
      
  //     setLoading(false);
  //   };

  //   fetchPosts();
  // },[]);

  const auth = useAuth()

  if(auth.loading) {
    return <Loader/>
  }

  return (
    <div className="App">
        

      <Switch>
        <Navbar/>

        <Routes>

          <Route exact path="/" element={<Home posts={[]}/>}/>

          <Route  path="/login" element={<Login/>}/>

          <Route  path="/register" element={<Signup/>}/>

          <Route  
            path="/settings" 
            element={
              <PrivateRoute>
                <Settings/>
              </PrivateRoute>
            }
          />

          <Route  
            path="/user/:userId" 
            element={
              <PrivateRoute>
                <UserProfile/>
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Page404/>}/>

        </Routes>
      </Switch>
      
    </div>
  );
}

export default App;
