    // ตัวอย่างการรวมข้อมูลจากการโหลดหลายหน้า
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const handleLoadMore = () => {
      setPage((prevPage) => prevPage + 1); // เพิ่มหมายเลขหน้าเพื่อโหลดข้อมูลเพิ่ม
    };

    // ฟังก์ชันดึงข้อมูลที่จะถูกเรียกเมื่อ page หรือ category เปลี่ยนแปลง
    useEffect(() => {
      fetchPosts();
    }, [page, category]);

    const fetchPosts = async () => {
      try {
        // ใช้ category parameter เฉพาะเมื่อไม่ใช่ Highlight
        const categoryParam = category === "Highlight" ? "" : category;
        
        const response = await axios.get(
          "https://blog-post-project-api.vercel.app/posts", {
            params: {
              page: page,
              limit: 6,
              category: categoryParam
            }
          }
        );
        
        // รวมโพสต์ใหม่กับโพสต์เดิม
        setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
        
        // ตรวจสอบว่าได้ข้อมูลหน้าสุดท้ายแล้วหรือยัง
        if (response.data.currentPage >= response.data.totalPages) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

