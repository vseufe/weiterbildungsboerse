import axios from 'axios';
import {
    deleteCourse,
    getCategories,
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    createFeedback,
    getCourseFeedback
} from '@/services/BackendService';

jest.mock('axios');

describe('BackendService.js', () => {
    afterEach(() => {
        axios.post.mockReset();
        axios.get.mockReset();
    });
    it('requests course data from the server', async () => {
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: [
                    {
                        id: 1,
                        title: 'Title1',
                        targetAudience: 'targetAudience1'
                    },
                    {
                        id: 2,
                        title: 'Title2',
                        targetAudience: 'targetAudience2'
                    }
                ]
            })
        );

        const courses = await getCourses();
        expect(axios.get).toHaveBeenCalledWith('courses');
        expect(courses.data).toHaveLength(2);
    });

    it('requests specific course from the server', async () => {
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: [
                    {
                        id: 1,
                        title: 'Title1',
                        targetAudience: 'targetAudience1'
                    }
                ]
            })
        );

        const courses = await getCourse(1);
        expect(axios.get).toHaveBeenCalledWith('courses/1');
        expect(courses.data).toHaveLength(1);
    });

    it('sends course data to the server', async () => {
        const course = {
            title: 'title',
            trainer: 'trainer',
            courseType: 'courseType',
            link: 'link'
        };

        axios.post.mockImplementationOnce(() =>
            Promise.resolve({
                data: course
            })
        );

        const response = await createCourse(course);
        expect(axios.post).toHaveBeenCalledWith('courses', course);
        expect(response.data).toBe(course);
    });

    it('sends updated course data to the server', async () => {
        const course = {
            id: 1,
            title: 'title',
            trainer: 'trainer',
            courseType: 'courseType',
            link: 'link'
        };

        axios.put.mockImplementationOnce(() =>
            Promise.resolve({
                data: course
            })
        );

        const response = await updateCourse(course);
        expect(axios.put).toHaveBeenCalledWith('courses/1', course);
        expect(response.data).toBe(course);
    });

    it('deletes course on the server side', async () => {
        axios.delete.mockImplementationOnce(() => Promise.resolve({}));

        await deleteCourse(1);
        expect(axios.delete).toHaveBeenCalledWith('courses/1');
    });

    it('requests categories from the server', async () => {
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: ['frontend', 'javascript']
            })
        );

        const categories = await getCategories();
        expect(axios.get).toHaveBeenCalledWith('categories');
        expect(categories.data).toHaveLength(2);
    });
    it('sends course feedback data to the server', async () => {
        const feedback = {
            participantName: 'user',
            dislikes: '',
            likes: 'good',
            recommendation: true
        };

        axios.post.mockImplementationOnce(() =>
            Promise.resolve({
                data: feedback
            })
        );

        const response = await createFeedback(2, feedback);
        expect(axios.post).toHaveBeenCalledWith('courses/2/feedback', feedback);
        expect(response.data).toEqual(feedback);
    });

    it('requests specific course feedback from the server', async () => {
        const feedbackList = [
            {
                participant_name: 'User1',
                dislikes: 'bad',
                likes: '',
                recommendation: false,
                feedbackTime: '2012-12-12T09:55:00Z'
            },
            {
                participant_name: 'User2',
                dislikes: '',
                likes: 'good',
                recommendation: true,
                feedbackTime: '2012-12-12T09:56:00Z'
            }
        ];
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: feedbackList
            })
        );

        const response = await getCourseFeedback(1);
        expect(axios.get).toHaveBeenCalledWith('courses/1/feedback');
        expect(response.data).toHaveLength(2);
        expect(response.data).toEqual([...feedbackList]);
    });
});
