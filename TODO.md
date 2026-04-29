# Fix Render Deployment: pkg_resources Error
Status: [In Progress]

## Steps:
- [x] Step 1: Edit backend/requirements.txt (remove gunicorn, add uvicorn, pin setuptools)
- [x] Step 2: Edit backend/render.yaml (update startCommand to uvicorn)
- [x] Step 3: Verify changes (render.yaml cleaned)
- [ ] Step 4: Commit/push + Render: Clear build cache & manual deploy
- [ ] Step 5: Mark complete

Next: Step 4 - Deploy!
