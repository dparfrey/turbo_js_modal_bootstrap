class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy]

  # GET /posts
  # GET /posts.json
  def index
    @posts = Post.all
  end

  def show
  end

  def new
    @post = Post.new
  end

  def edit
  end

  def create
    @post = Post.new(post_params)

    respond_to do |format|
      if @post.save
        format.html { redirect_to posts_url, notice: 'Post was successfully created.', status: :unprocessable_entity }
      else
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace('post-modal-form',
                                                    partial: 'posts/modal_add_edit_form',
                                                    locals: { post: @post, reloading: true })
        end
      end
    end
  end

  def update
    respond_to do |format|
      if @post.update(post_params)
        format.turbo_stream { render turbo_stream: turbo_stream.update(@post) }
        format.html { redirect_to posts_url, notice: 'Post was successfully updated.', status: :unprocessable_entity }
      else
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace('post-modal-form',
                                                    partial: 'posts/modal_add_edit_form',
                                                    locals: { post: @post, reloading: true })
        end
      end
    end
  end

  def destroy
    @post.destroy
    respond_to do |format|
      format.turbo_stream { render turbo_stream: turbo_stream.remove(@post) }
      format.html { redirect_to posts_url, notice: 'Post was successfully destroyed.' }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_post
    @post = Post.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def post_params
    params.require(:post).permit(:title, :body)
  end
end
