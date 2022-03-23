import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const pageEnd = useRef();

  const API_KEY = process.env.REACT_APP_API_KEY;
  const URL = `https://api.unsplash.com/photos/?client_id=${API_KEY}&page=${pageNumber}&per_page=10`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(URL);
        const data = await response.json();

        data.map((item) => (item.id = uuidv4()));

        setPhotos((prevPhotos) => [...prevPhotos, ...data]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error);
      }
    };
    fetchData();
  }, [URL]);

  const loadMore = () => {
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const handleIntersect = ([target]) => {
      if (target.isIntersecting) loadMore();
    };

    if (!loading) {
      const observer = new IntersectionObserver(handleIntersect, options);

      observer.observe(pageEnd.current);

      return () => {
        if (observer & pageEnd) {
          observer.unobserve(pageEnd);
        }
      };
    }
  }, [loading]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const photoList = photos.map((photo) => (
    <section className='photos' key={photo.id}>
      <img src={photo.urls.thumb} alt={photo.urls.alt_description} />
      <p>
        {photo.user.first_name} {photo.user.last_name}
      </p>
    </section>
  ));

  return (
    <main>
      {photoList}
      <footer ref={pageEnd}></footer>
    </main>
  );
};

export default App;
