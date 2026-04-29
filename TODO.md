# Fix Render Deployment: pkg_resources Error
Status: [In Progress]

## Steps:
- [x] Step 1: Edit backend/requirements.txt (remove gunicorn, add uvicorn, pin setuptools)
- [x] Step 2: Edit backend/render.yaml (update startCommand to uvicorn)
- [ ] Step 3: Verify changes
- [ ] Step 4: Instruct user to commit/push/redeploy on Render
- [ ] Step 5: Mark complete

Next: Step 1.
