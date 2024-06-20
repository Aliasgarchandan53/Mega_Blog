import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input, RTE, Select, Button } from '../index';
import appwriteService from '../../appwrite/configdb';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.slug || '',
            content: post?.content || '',
            status: post?.status || 'active',
        },
    });
    const navigate = useNavigate();
    const usersData = useSelector((state) => state.auth.userData);

    // Log userData
    useEffect(() => {
        // console.log('User Data in PostForm:', usersData);
    }, [usersData]);

    const submit = async (data) => {
        try {
            if (post) {
                const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;
                if (file) {
                    await appwriteService.deleteFile(post.featuredimageid);
                }
                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    featuredimageid: file ? file.$id : post.featuredimageid,
                });
                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            } else {
                const file = await appwriteService.uploadFile(data.image[0]);
                if (file) {
                    data.featuredimageid = file.$id;
                    // Log userData before creating post
                    const dbPost = await appwriteService.createPost({
                        ...data,
                        userid: usersData.$id,
                    });
                    if (dbPost) {
                        navigate(`/post/${dbPost.$id}`);
                    }
                }
            }
        } catch (error) {
            console.error('Form submit error', error);
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === 'string') {
            return value.trim().toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        }
        return '';
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'title') {
                setValue('slug', slugTransform(value.title), { shouldValidate: true });
            }
        });
        return () => {
            subscription.unsubscribe();
        };
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register('title', { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register('slug', { required: true })}
                    onInput={(e) => {
                        setValue('slug', slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues('content')} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register('image', { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredimageid)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={['active', 'inactive']}
                    label="Status"
                    className="mb-4"
                    {...register('status', { required: true })}
                />
                <Button type="submit" bgColor={post ? 'bg-green-500' : undefined} className="w-full">
                    {post ? 'Update' : 'Submit'}
                </Button>
            </div>
        </form>
    );
}

export default PostForm;
