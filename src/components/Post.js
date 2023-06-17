import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {Comment} from './index'
import styles from '../styles/home.module.css'
import { useState } from 'react';
import { useAuth, usePosts } from '../hooks';
import { useToasts } from 'react-toast-notifications';
import { createComment, toggleLike } from '../api';


const Post = ({post})=> {
    const [comment,setComment] = useState('');
    const [creatingComment,setCreatingComment] = useState(false);
    const posts = usePosts();
    const auth = useAuth();
    const {addToast} = useToasts();

    const handlePostDelete =  () => {
        console.log(post._id);
        posts.deletePostFromState(post._id);
    }

    const handleAddComment = async (e) => {
        if(e.key === 'Enter'){
            setCreatingComment(true);

            const response = await createComment(comment,post._id);

            if(response.success) {
                setComment('');
                posts.addComment(response.data.comment, post._id);
                addToast('Comment created successfully!', {
                    appearance: 'success',
                  });
            } else {
                addToast(response.message, {
                appearance: 'error',
                });
            }

            setCreatingComment(false);
        }
    }

    const handlePostLikeClick = async ()=> {
        const response = await toggleLike(post._id,'Post');
        if(response.success) {
            if(response.data.deleted) {
                post.likes.pop();
                addToast('Like remove successfully!', {
                    appearance: 'success',
                });
            } else {
                post.likes.push(1);

                addToast('Like added successfully!', {
                    appearance: 'success',
                });
            }
            
        } else {
            addToast(response.message, {
            appearance: 'error',
            });
        }
    }

    return (
        <div className={styles.postWrapper} key = {`post-${post._id}`}>
            <div className={styles.postHeader}>
                <div className={styles.postAvatar}>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/921/921071.png"
                        alt="user-pic"
                    />
                    <div>
                        {/* <Link to={`/user/${post.user._id}`} state={{user:post.user}} className={styles.postAuthor}>{post.user.name}</Link> */}
                        
                        {/* {auth.user._id === post.user._id ? <>
                            <Link to="./settings" className={styles.postAuthor}>{post.user.name}</Link>
                        </> : <> */}
                            <Link 
                                to={{
                                pathname:`/user/${post.user._id}`,
                                state: {
                                    user: post.user,
                                },
                                }}
                                className={styles.postAuthor}
                            >
                                {post.user.name}
                            </Link>
                        {/* </>} */}

                        <span className={styles.postTime}>a minute ago</span>
                        {/* {auth.user._id === post.user._id &&
                            <>
                                <button onClick={handlePostDelete}>
                                    Delete Post
                                </button>
                            </>
                        } */}
                    </div>
                </div>
                <div className={styles.postContent}>{post.content}</div>
    
                <div className={styles.postActions}>
                    <div className={styles.postLike}>
                        <button onClick={handlePostLikeClick}>
                            <img
                                src="https://t4.ftcdn.net/jpg/05/77/64/11/240_F_577641157_isqS31qXZF2qJg0Vz6kDNe5v3uNtvRM6.jpg"
                                alt="likes-icon"
                            />
                        </button>
                        
                        <span>{post.likes.length}</span>
                    </div>
        
                    <div className={styles.postCommentsIcon}>
                        <img
                            src="https://t3.ftcdn.net/jpg/03/04/48/64/240_F_304486491_txwLytsK3xy7YpyBt7edYFTdMuuuBr2v.jpg"
                            alt="comments-icon"
                        />
                        <span>{post.comments.length}</span>
                    </div>
                </div>

                <div className={styles.postCommentBox}>
                    <input 
                        placeholder="Start typing a comment"
                        value={comment}
                        onChange={(e)=>setComment(e.target.value)}
                        onKeyDown={handleAddComment}
                    />
                </div>
    
                <div className={styles.postCommentsList}>
                    {post.comments.map((comment) => (
                    <Comment comment={comment} key={`post-comment-${comment._id}`}/>
                    ))}
                </div>
            </div>
        </div>
    );
}

Post.propTypes = {
    post: PropTypes.object.isRequired,
  }; 

export default Post;