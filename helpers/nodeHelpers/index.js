module.exports = {
    isDevelopment: () => {
        // Check env variables for node_env and return true if node_env is set to development, false if anything else
            if (process.env.NODE_ENV === "development") {
                return true;
            }
            else return false;
        }
}