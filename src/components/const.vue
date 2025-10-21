<script>
import { ref } from 'vue';

const backendurl = "http://103.238.187.3:8080"
const uniauthurl = "http://103.238.187.3:8500"
// const backendurl="http://localhost:14568"

const username=ref("")
export default
{
    backendurl,
    uniauthurl,
    username
}
</script>
