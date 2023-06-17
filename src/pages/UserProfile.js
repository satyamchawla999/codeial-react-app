import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import {Loader} from '../components';
import { useToasts } from 'react-toast-notifications';
import styles from '../styles/settings.module.css';
import { addFriend, fetchUserProfile, removeFriend } from '../api';

const UserProfile = ()=> {
    const [user,setUser] = useState({});
    const [loading,setLoading] = useState(true);
    const [requestInProgress,setRequestInProgress] = useState(false);
    const {userId} = useParams();
    const {addToast} = useToasts()
    const navigate = useNavigate();
    const auth = useAuth();
    // console.log('auth',auth);

    useEffect(() => {
        // console.log('auth',auth);
        
        const getUser  = async ()=> {
            const response = await fetchUserProfile(userId)
            
            if(response.success) {
                setUser(response.data.user);
            } else {
                addToast(response.message, {
                    appearance: 'error',
                });
                return navigate('/');
            }
            setLoading(false);
        }

        getUser();
    },[userId,navigate,addToast])

    if(loading) {
        return <Loader/>
    }

    const checkIfUserIsAFriend =  ()=> {
        const friends  = auth.user.friendships;
        const friendIds =  friends.map((friend) => friend.to_user._id);
        const index = friendIds.indexOf(userId);

        if(index !== -1) {
            return true;
        }

        return false;
    };

    const handleRemoveFriendClick = async ()=> {
        setRequestInProgress(true);

        const response = await removeFriend(userId);

        if(response.success) {
            const frindship = auth.user.friendships.filter(
                (friend)=> friend.to_user._id === userId
            );

            auth.updateUserFriends(false,frindship[0])
            addToast('Friend removed successfully',{
                appearance: 'success',
            })
        } else {
            addToast(response.message,{
                appearance:'error',
            })
        }
        setRequestInProgress(false);
    }

    const handleAddFriendClick = async ()=> {
        setRequestInProgress(true);

        const response = await addFriend(userId);
        if(response.success) {
            const {friendship} = response.data;

            auth.updateUserFriends(true,friendship)
            addToast('Friend added successfully',{
                appearance: 'success',
            })
        } else {
            addToast(response.message,{
                appearance:'error',
            })
        }
        setRequestInProgress(false);
    }


    return (
        <div className = {styles.settings}>
            <div className={styles.imgContainer}>
                <img
                    src="https://cdn-icons-png.flaticon.com/512/921/921071.png"
                    alt="avataar"
                />
            </div>

            <div className={styles.field}>
                <div className={styles.fieldLabel}>Email</div>
                <div className={styles.fieldValue}>{user.email}</div>
            </div>

            <div className={styles.field}>
                <div className={styles.fieldLabel}>Name</div>
                <div className={styles.fieldValue}>{user.name}</div>    
            </div>

            <div className={styles.btnGrp}>

                {checkIfUserIsAFriend() ? <>
                    <button 
                        className={`button ${styles.saveBtn}`} 
                        onClick={handleRemoveFriendClick}
                    >
                        {requestInProgress? 'Removing friend...' : 'Remove Friend'}
                    </button>
                </> : <>
                    <button 
                        className={`button ${styles.saveBtn}`} 
                        onClick={handleAddFriendClick} 
                        disabled={requestInProgress}
                    >
                        {requestInProgress? 'Adding friend...' : 'Add Friend'}
                    </button>
                </>}
                
            </div>
        </div>
    );
}

export default UserProfile;