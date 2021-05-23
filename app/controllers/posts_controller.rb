class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy]

  # GET /posts
  # GET /posts.json
  def index
    @posts = Post.all.order(created_at: :desc)
  end

  def show; end

  def new
    @post = Post.new
    render layout: false
  end

  def edit
    render layout: false
  end

  def create
    @post = Post.new(post_params)

    respond_to do |format|
      if @post.save
        format.html { head :no_content }
      else
        Rails.logger.error(@post.errors.full_messages)
        render layout: false, status: unprocessable_entity
      end
    end
  end

  def update
    respond_to do |format|
      if @post.update(post_params)
        format.html { render layout: false }
      else
        # head :no_content
        render layout: false, status: unprocessable_entity
      end
    end
  end

  def destroy
    @post.destroy
    respond_to do |format|
      format.html { head :no_content }
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
