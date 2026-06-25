require


const app = express();
const port = 3000;

app.use(express.json());

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});     