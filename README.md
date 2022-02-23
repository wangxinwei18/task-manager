# task-manager

# push project first

echo "# task-manager" >> README.md
git init
git add .
git status
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/wangxinwei18/task-manager.git
git push -u origin main

# pull down files

git pull origin main

# push project again

git status
git add .
git commit -m "again commit"
git branch -M main
git push -u origin main

# test ssh key

push to gitee test
test2
test3
